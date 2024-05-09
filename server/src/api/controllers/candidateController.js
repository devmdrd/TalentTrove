const Candidate = require("../models/candidateModel");
const Experience = require("../models/experienceModel");
const Project = require("../models/projectModel");
const Education = require("../models/educationModel");
const Certification = require("../models/certificateModel");
const Job = require("../models/jobModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const sendEmail = require("../helpers/nodemailer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Company = require("../models/companyModel");
const Application = require("../models/applicationModel");
const SkillTestAssignment = require("../models/skillTestAssignmentModel");
const SkillTest = require("../models/skillTestModel");
const Chat = require("../models/ChatModel");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");
require("dotenv").config();

// authentication controllers
// const signup = async (req, res) => {
//   try {
//     console.log(req.body)
//     const { name, mobile, email, password } = req.body;

//     const existingCandidate = await Candidate.findOne({ email });

//     if (existingCandidate) {
//       return res.status(400).json({ error: "Candidate Already Exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newCandidate = new Candidate({
//       name,
//       email,
//       mobile,
//       password: hashedPassword,
//     });

//     await newCandidate.save();

//     res.status(201).json({ message: "Registration Successfull" });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
const sendOTPByEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "mr0248974@gmail.com",
      auth: {
        user: "mr0248974@gmail.com",
        pass: "rtjn bulv gjta olea",
      },
    });

    await transporter.sendMail({
      from: "mr0248974@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for registration is: ${otp}`,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Error sending OTP email");
  }
};
const signup = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    const existingCandidate = await Candidate.findOne({ email });

    if (existingCandidate) {
      return res.status(400).json({ error: "Candidate Already Exists" });
    }

    const otpCode = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    const candidate = new Candidate({
      name,
      email,
      mobile,
      password: hashedPassword,
      otp: otpCode,
      otpCreatedAt: new Date(),
      otpExpiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    await candidate.save();

    await sendOTPByEmail(email, otpCode);
    setTimeout(async () => {
      try {
        await Candidate.findOneAndDelete({
          email,
          otpExpiresAt: { $lte: new Date() },
        });
      } catch (error) {
        console.error("Error removing expired OTP:", error);
      }
    }, 30 * 1000);

    res.status(200).json({ message: "OTP sent for verification" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const existingCandidate = await Candidate.findOne({ email });

    if (!existingCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const newOTP = generateOTP();
    existingCandidate.otp = newOTP;
    existingCandidate.otpCreatedAt = new Date();
    existingCandidate.otpExpiresAt = new Date(Date.now() + 30 * 1000);
    await existingCandidate.save();
    await sendOTPByEmail(email, newOTP);
    setTimeout(async () => {
      try {
        await Candidate.findOneAndUpdate(
          { email, otpExpiresAt: { $lte: new Date() } },
          { $unset: { otp: 1, otpCreatedAt: 1, otpExpiresAt: 1 } }
        );
        console.log("Expired OTP removed from database");
      } catch (error) {
        console.error("Error removing expired OTP:", error);
      }
    }, 30 * 1000);
    return res.status(200).json({ message: "OTP resent successfully", newOTP });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ message: "Error resending OTP" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpString = otp.join("");

    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(400).json({ error: "Candidate not found" });
    }

    if (candidate.otp && candidate.otpExpiresAt > new Date()) {
      if (candidate.otp === otpString) {
        console.log("entered");
        candidate.otp = "";
        candidate.otpExpiresAt = null;
        await candidate.save();

        return res
          .status(200)
          .json({ success: true, message: "OTP verification successful" });
      } else {
        return res.status(400).json({ error: "Invalid OTP" });
      }
    } else {
      return res.status(400).json({ error: "OTP expired or not generated" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(401).json({ error: "Account doesn't Exist" });
    }
    if (candidate.isBlocked) {
      return res.status(403).json({
        error: "Your account is blocked. Contact support for assistance.",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, candidate.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Update candidate's online status to "online"
    await Candidate.updateOne({ _id: candidate._id }, { online: true });

    const token = jwt.sign(
      { userId: candidate._id, role: candidate.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    // res.cookie("token", token, { httpOnly: true });
    res.json({
      success: true,
      message: "Login Successfull",
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res
        .status(401)
        .json({ message: "Candidate Account doesn't exist" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    candidate.resetToken = resetToken;
    candidate.resetTokenExpires = Date.now() + 3600000;
    await candidate.save();
    const resetLink = `http://localhost:3000/reset/${resetToken}`;

    const mailOptions = {
      from: "mr0248974@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    };
    await sendEmail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const resetPasssword = async (req, res) => {
  const { password, token } = req.body;
  const candidate = await Candidate.findOne({ resetToken: token });
  if (!candidate) {
    return res.status(500).json({ message: "Token not found" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await Candidate.updateOne(
      {
        resetToken: token,
      },
      {
        $set: {
          password: hashedPassword,
          resetToken: undefined,
          resetTokenExpires: undefined,
        },
      }
    );
    res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    console.error(error);
  }
};

// resume controllers
const resumeUpload = async (req, res) => {
  try {
    const resumePath = req.file.path;
    const imageUrl = resumePath.replace("src\\api\\public\\", "");

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    candidate.resumeOrCv = imageUrl;
    await candidate.save();

    res.json({
      success: true,
      message: "Candidate profile resume updated successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    const resumeOrCv = candidate.resumeOrCv;
    res.status(200).json({ resume: resumeOrCv });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// profile controllers
const getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// title controllers
const saveTitle = async (req, res) => {
  try {
    const { title } = req.body;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    candidate.name = title;
    await candidate.save();
    res.status(200).json({ title: candidate.name });
  } catch (error) {
    console.error("Error saving title:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getTitle = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json({ title: candidate.name });
  } catch (error) {
    console.error("Error fetching title:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// image controllers
const saveImage = async (req, res) => {
  try {
    const profilePicture = req.file.path;

    const imageUrl = path.relative("src/api/public", profilePicture);

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    candidate.profilePicture = imageUrl;
    await candidate.save();

    res.json({
      success: true,
      message: "Profile pic updated successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error saving profile picture:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getImage = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json({ profilePicture: candidate.profilePicture });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// about controllers
const saveAbout = async (req, res) => {
  try {
    const { aboutText } = req.body;
    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    candidate.about = aboutText;

    await candidate.save();

    res.status(200).json({
      message: "About text saved successfully",
      about: candidate.about,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAbout = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const aboutText = candidate.about;
    res.status(200).json({ aboutText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// skills controllers
const addSkill = async (req, res) => {
  try {
    const { newSkill } = req.body;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    candidate.skills.push(newSkill);
    await candidate.save();
    res.json({
      success: true,
      message: "Skill added successfully",
      skills: candidate.skills,
    });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getSkills = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    const skills = candidate.skills;
    res.status(200).json({ success: true, skills: skills });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const removeSkill = async (req, res) => {
  try {
    const { index } = req.params;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    candidate.skills.splice(index, 1);

    await candidate.save();

    res.status(200).json({ message: "Skill removed successfully", candidate });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// languages controllers
const addLanguage = async (req, res) => {
  try {
    const { name, proficiency } = req.body;

    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.json({ error: "Candidate details not found" });
    }
    candidate.languages.push({ name, proficiency });

    await candidate.save();

    res.status(200).json({ message: "Language added successfully", candidate });
  } catch (error) {
    console.error("Error adding language:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getLanguages = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.status(200).json({ languages: candidate.languages });
  } catch (error) {
    console.error("Error getting languages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;
    const { name, proficiency } = req.body;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const language = candidate.languages.id(languageId);
    if (!language) {
      return res.status(404).json({ error: "Language not found" });
    }

    language.name = name;
    language.proficiency = proficiency;

    await candidate.save();

    res
      .status(200)
      .json({ message: "Language updated successfully", candidate });
  } catch (error) {
    console.error("Error editing language:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteLanguage = async (req, res) => {
  try {
    const { languageId } = req.params;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    candidate.languages.pull(languageId);
    await candidate.save();

    res
      .status(200)
      .json({ message: "Language deleted successfully", candidate });
  } catch (error) {
    console.error("Error deleting language:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// experiences controllers
const addExperience = async (req, res) => {
  try {
    const { title, companyName, yearsOfExperience, description } = req.body;

    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate details not found" });
    }

    const newExperience = new Experience({
      title,
      companyName: companyName,
      yearsOfExperience: yearsOfExperience,
      description,
    });

    await newExperience.save();

    candidate.experienceId.push(newExperience._id);

    await candidate.save();
    const experienceIds = candidate.experienceId;
    const experiences = await Experience.find({ _id: { $in: experienceIds } });
    res
      .status(200)
      .json({ message: "Experience added successfully", experiences });
  } catch (error) {
    console.error("Error adding experience:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getExperiences = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const experienceIds = candidate.experienceId;

    const experiences = await Experience.find({ _id: { $in: experienceIds } });

    res.status(200).json({ experiences });
  } catch (error) {
    console.error("Error getting experiences:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editExperience = async (req, res) => {
  try {
    console.log("started");
    const { experienceId } = req.params;
    const { title, companyName, yearsOfExperience, description } = req.body;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    experience.title = title;
    experience.companyName = companyName;
    experience.yearsOfExperience = yearsOfExperience;
    experience.description = description;

    await experience.save();
    const experienceIds = candidate.experienceId;
    const experiences = await Experience.find({ _id: { $in: experienceIds } });
    res
      .status(200)
      .json({ message: "Experience updated successfully", experiences });
  } catch (error) {
    console.error("Error editing experience:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ error: "Experience not found" });
    }

    candidate.experienceId.pull(experienceId);
    await candidate.save();
    const experienceIds = candidate.experienceId;
    const experiences = await Experience.find({ _id: { $in: experienceIds } });
    res
      .status(200)
      .json({ message: "Experience deleted successfully", experiences });
  } catch (error) {
    console.error("Error deleting experience:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// projects controllers
const addProject = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, link } = req.body;

    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate details not found" });
    }

    const newProject = new Project({
      name,
      description,
      link,
    });

    await newProject.save();

    candidate.projectId.push(newProject._id);

    await candidate.save();
    const projectIds = candidate.projectId;
    const projects = await Project.find({ _id: { $in: projectIds } });
    res.status(200).json({ message: "Project added successfully", projects });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getProjects = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const projectIds = candidate.projectId;

    const projects = await Project.find({ _id: { $in: projectIds } });

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error getting projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, link } = req.body;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    project.name = name;
    project.description = description;
    project.link = link;

    await project.save();
    const projectIds = candidate.projectId;
    const projects = await Project.find({ _id: { $in: projectIds } });
    res.status(200).json({ message: "Project updated successfully", projects });
  } catch (error) {
    console.error("Error editing project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    candidate.projectId.pull(projectId);
    await candidate.save();
    const projectIds = candidate.projectId;
    const projects = await Project.find({ _id: { $in: projectIds } });
    res.status(200).json({ message: "Project deleted successfully", projects });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// educations controllers
const addEducation = async (req, res) => {
  try {
    const { degree, institution, year } = req.body;

    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate details not found" });
    }

    const newEducation = new Education({
      degree,
      institution,
      year,
    });

    await newEducation.save();

    candidate.educationId.push(newEducation._id);

    await candidate.save();
    const educationIds = candidate.educationId;
    const educations = await Education.find({ _id: { $in: educationIds } });
    res
      .status(200)
      .json({ message: "Education added successfully", educations });
  } catch (error) {
    console.error("Error adding education:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getEducations = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const educationIds = candidate.educationId;

    const educations = await Education.find({ _id: { $in: educationIds } });

    res.status(200).json({ educations });
  } catch (error) {
    console.error("Error getting educations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editEducation = async (req, res) => {
  try {
    const { educationId } = req.params;
    const { degree, institution, year } = req.body;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const education = await Education.findById(educationId);
    if (!education) {
      return res.status(404).json({ error: "Education not found" });
    }

    education.degree = degree;
    education.institution = institution;
    education.year = year;

    await education.save();
    const educationIds = candidate.educationId;
    const educations = await Education.find({ _id: { $in: educationIds } });
    res
      .status(200)
      .json({ message: "Education updated successfully", educations });
  } catch (error) {
    console.error("Error editing education:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteEducation = async (req, res) => {
  try {
    const { educationId } = req.params;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const education = await Education.findById(educationId);
    if (!education) {
      return res.status(404).json({ error: "education not found" });
    }

    candidate.educationId.pull(educationId);
    await candidate.save();
    const educationIds = candidate.educationId;
    const educations = await Education.find({ _id: { $in: educationIds } });
    res
      .status(200)
      .json({ message: "Project deleted successfully", educations });
  } catch (error) {
    console.error("Error deleting education:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// certifications controllers
const addCertification = async (req, res) => {
  try {
    const { name, organization, year } = req.body;

    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate details not found" });
    }

    const newCertification = new Certification({
      name,
      organization,
      year,
    });

    await newCertification.save();

    candidate.certificationId.push(newCertification._id);

    await candidate.save();
    const certificationIds = candidate.certificationId;
    const certifications = await Certification.find({
      _id: { $in: certificationIds },
    });
    res
      .status(200)
      .json({ message: "Certification added successfully", certifications });
  } catch (error) {
    console.error("Error adding certification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getCertifications = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user._id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const certificationIds = candidate.certificationId;

    const certifications = await Certification.find({
      _id: { $in: certificationIds },
    });

    res.status(200).json({ certifications });
  } catch (error) {
    console.error("Error getting certifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editCertification = async (req, res) => {
  try {
    const { certificationId } = req.params;
    const { name, organization, year } = req.body;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({ error: "Certification not found" });
    }

    certification.name = name;
    certification.organization = organization;
    certification.year = year;

    await certification.save();
    const certificationIds = candidate.certificationId;
    const certifications = await Certification.find({
      _id: { $in: certificationIds },
    });
    res
      .status(200)
      .json({ message: "Certification updated successfully", certifications });
  } catch (error) {
    console.error("Error editing certification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteCertification = async (req, res) => {
  try {
    const { certificationId } = req.params;

    const candidate = await Candidate.findById(req.user._id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({ error: "certification not found" });
    }

    candidate.certificationId.pull(certificationId);
    await candidate.save();
    const certificationIds = candidate.certificationId;
    const certifications = await Certification.find({
      _id: { $in: certificationIds },
    });
    res
      .status(200)
      .json({ message: "Certificate deleted successfully", certifications });
  } catch (error) {
    console.error("Error deleting certification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// jobs controllers
// const getJobs = async (req, res) => {
//   console.log("yuin")
//   try {
//     const candidate = await Candidate.findById(req.user._id);

//     if (!candidate) {
//       return res.status(404).json({ error: "Candidate details not found" });
//     }
//     const jobs = await Job.find();
//     res.json(jobs);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
const getJobs = async (req, res) => {
  try {
    let {
      jobKey,
      locationKey,
      experience,
      salary,
      sortBy,
      sortOrder,
      currentPage,
      jobsPerPage,
    } = req.query;

    // Build filtering criteria
    const filterCriteria = {};
    if (jobKey) {
      filterCriteria.title = new RegExp(jobKey, "i");
    }
    if (locationKey) {
      filterCriteria.location = new RegExp(locationKey, "i");
    }
    if (experience) {
      if (experience === "<3") {
        filterCriteria.experienceRequired = { $lt: 3 };
      } else if (experience === "3-5") {
        filterCriteria.experienceRequired = { $gte: 3, $lte: 5 };
      } else if (experience === ">5") {
        filterCriteria.experienceRequired = { $gt: 5 };
      } else {
        filterCriteria.experienceRequired = experience;
      }
    }

    if (salary) {
      if (salary.includes("-")) {
        const [minSalary, maxSalary] = salary
          .split("-")
          .map((s) => parseInt(s.replace("₹", "").replace(",", ""), 10));
        filterCriteria.salary = { $gte: minSalary, $lte: maxSalary };
      } else if (salary === "₹10,000") {
        filterCriteria.salary = { $lt: 10000 };
      } else if (salary === "₹10,000-₹30,000") {
        filterCriteria.salary = { $gte: 10000, $lte: 30000 };
      } else if (salary === "₹30,000") {
        filterCriteria.salary = { $gt: 30000 };
      } else {
        filterCriteria.salary = salary;
      }
    }

    // Apply filtering
    let filteredJobs = await Job.find(filterCriteria);

    // Sorting
    const sortOrderValue = sortOrder === "asc" ? 1 : -1;
    filteredJobs = filteredJobs.sort((a, b) => {
      return sortOrderValue * (a._id.getTimestamp() - b._id.getTimestamp());
    });

    // Pagination
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    res.json({ currentJobs, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getJobById = async (req, res) => {
  const { jobId } = req.query;

  try {
    const candidateId = req.user._id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ error: "Job not found" });
    }

    const company = await Company.findOne({ jobId: jobId });
    if (!company) {
      return res.status(400).json({ error: "Company not found for the job" });
    }
    res.json({ job: job, company: company });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const appliedJobs = async (req, res) => {
  try {
    const candidateId = req.user._id;
    const applications = await Application.find({ candidateId })
      .populate("jobId")
      .populate("companyId");
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const jobStatus = async (req, res) => {
  const { applicationId } = req.query;

  try {
    const application = await Application.findById(applicationId)
      .populate("candidateId") // Assuming you have a Candidate model
      .populate("jobId")
      .populate("companyId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Return job, company, and application details
    res.json({
      job: application.jobId,
      company: application.companyId,
      candidate: application.candidateId,
      application,
    });
  } catch (error) {
    console.error("Error fetching job status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const searchJobs = async (req, res) => {
  let { title, location } = req.query;

  if (!title) title = "";
  if (!location) location = "";

  try {
    let jobs;
    if (title === "" && location === "") {
      jobs = await Job.find();
    } else {
      jobs = await Job.find({
        title: { $regex: new RegExp(title, "i") },
        location: { $regex: new RegExp(location, "i") },
      });
    }
    res.json(jobs);
  } catch (error) {
    console.error("Error searching for jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const filterJobs = async (req, res) => {
  try {
    const { jobKey, locationKey, experience, salary, jobType } = req.query;
    let filteredJobs = await Job.find();
    if (jobKey) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(jobKey.toLowerCase())
      );
    }

    if (locationKey) {
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(locationKey.toLowerCase())
      );
    }

    if (experience) {
      filteredJobs = filteredJobs.filter(
        (job) => job.experienceRequired === experience
      );
    }

    if (salary) {
      filteredJobs = filteredJobs.filter((job) => job.salary === salary);
    }

    if (jobType) {
      filteredJobs = filteredJobs.filter((job) => job.jobType === jobType);
    }
    res.status(200).json(filteredJobs);
  } catch (error) {
    console.error("Error filtering jobs:", error);
    res.status(500).json({ message: "Error filtering jobs" });
  }
};
const getSkillTest = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const skillTestAssignmentDetails = await SkillTestAssignment.findOne({
      application: applicationId,
    });
    const skillTestId = skillTestAssignmentDetails
      ? skillTestAssignmentDetails.skillTest
      : null;
    if (skillTestId) {
      res.json(skillTestId);
    } else {
      res.status(404).json({ error: "Skill test not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getSkillTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const skillTest = await SkillTest.findById(id);
    res.json(skillTest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const submitTest = async (req, res) => {
  try {
    const { answers, score, applicationId } = req.body;

    // Find SkillTestAssignment by applicationId
    const skillTestAssignment = await SkillTestAssignment.findOne({
      application: applicationId,
    });

    // Check if SkillTestAssignment exists
    if (!skillTestAssignment) {
      return res.status(404).json({ error: "Skill test assignment not found" });
    }

    // Update SkillTestAssignment with the new score
    await SkillTestAssignment.updateOne(
      { _id: skillTestAssignment._id },
      { score }
    );

    res.status(200).json({ message: "Test submitted successfully" });
  } catch (err) {
    console.error("Error in submitTest:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// application controllers
const createApplication = async (req, res) => {
  const { jobId, companyId } = req.body;
  const candidateId = req.user._id;

  try {
    const newApplication = new Application({
      jobId,
      companyId,
      candidateId,
    });

    const savedApplication = await newApplication.save();

    return res.status(200).json({
      message: "Application created successfully",
      application: savedApplication,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return res.status(500).json({ error: "Error creating application" });
  }
};

// chat controllers
const getMessagesWithRecruiter = async (req, res) => {
  const candidateId = req.user._id;
  const { recruiterId } = req.params;
  try {
    const chat = await Chat.findOne({
      company: recruiterId, // Assuming the company field stores the recruiter's ID
      "candidates.candidateId": candidateId,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "No chat found for the candidate and recruiter" });
    }

    const candidateChat = chat.candidates.find(
      (candidate) => candidate.candidateId.toString() === candidateId.toString()
    );

    if (!candidateChat) {
      return res
        .status(404)
        .json({ message: "No chat found for the candidate" });
    }

    const messages = await Message.find({
      _id: { $in: candidateChat.messages },
    });
    const formattedMessages = messages.map((message) => {
      return {
        content: message.content,
        sender: message.sender,
        files: message.files,
        timestamp: message.formattedCreatedAt, // Use formattedCreatedAt
      };
    });

    res.status(200).json(formattedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllRecruitersForCandidate = async (req, res) => {
  const candidateId = req.user._id;
  try {
    const chats = await Chat.find({
      "candidates.candidateId": candidateId,
    }).populate("company");

    if (!chats || chats.length === 0) {
      return res
        .status(404)
        .json({ message: "No chats found for the candidate" });
    }

    const recruiters = chats.map((chat) => ({
      id: chat.company._id,
      name: chat.company.name,
    }));

    res.status(200).json(recruiters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const postMessageForRecruiter = async (req, res) => {
  const candidateId = req.user._id;
  const { recruiterId } = req.params;
  const { content, sender } = req.body;

  try {
    let chat = await Chat.findOne({
      company: recruiterId,
      "candidates.candidateId": candidateId,
    });

    if (!chat) {
      // Create a new chat if it doesn't exist
      chat = new Chat({
        company: recruiterId,
        candidates: [{ candidateId, messages: [] }],
      });
    }

    const candidateChat = chat.candidates.find(
      (candidate) => candidate.candidateId.toString() === candidateId.toString()
    );

    if (!candidateChat) {
      // Add a new candidate if not found
      chat.candidates.push({ candidateId, messages: [] });
    }

    const newMessage = new Message({
      content,
      sender,
    });

    await newMessage.save();

    candidateChat.messages.push(newMessage._id);
    await chat.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// notification controllers
const getAllNotifications = async (req, res) => {
  try {
    const candidateId = req.user._id;
    const notifications = await Notification.find({ recipient: candidateId })
      .sort({ createdAt: -1 })
      .limit(3);
    const unreadCount = await Notification.countDocuments({
      recipient: candidateId,
      read: false,
    });
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const readNotifications = async (req, res) => {
  const { notificationId } = req.body;
  try {
    const notification = await Notification.findByIdAndUpdate(notificationId, {
      read: true,
    });
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// logout
const logout = async (req, res) => {
  console.log("cvhbjnk");
  try {
    const candidateId = req.user._id;
    // Update candidate's online status to "offline"
    await Candidate.updateOne({ _id: candidateId }, { online: false });
    res.json({ success: true, message: "Candidate logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  resendOtp,
  verifyOTP,
  signin,
  forgotPassword,
  resetPasssword,
  resumeUpload,
  getResume,
  getProfile,
  saveTitle,
  getTitle,
  saveImage,
  getImage,
  saveAbout,
  getAbout,
  addSkill,
  getSkills,
  removeSkill,
  addLanguage,
  getLanguages,
  editLanguage,
  deleteLanguage,
  addExperience,
  getExperiences,
  editExperience,
  deleteExperience,
  addProject,
  getProjects,
  editProject,
  deleteProject,
  addEducation,
  getEducations,
  editEducation,
  deleteEducation,
  addCertification,
  getCertifications,
  editCertification,
  deleteCertification,
  getJobs,
  getJobById,
  appliedJobs,
  jobStatus,
  searchJobs,
  filterJobs,
  getSkillTest,
  getSkillTestById,
  submitTest,
  createApplication,
  getMessagesWithRecruiter,
  getAllRecruitersForCandidate,
  postMessageForRecruiter,
  getAllNotifications,
  readNotifications,
  logout,
};
