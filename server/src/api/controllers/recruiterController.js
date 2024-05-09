const Recruiter = require("../models/recruiterModel");
const Company = require("../models/companyModel");
const Application = require("../models/applicationModel");
const SkillTestAssignment = require("../models/skillTestAssignmentModel");
const Job = require("../models/jobModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const uuid = require("uuid");
const sendEmail = require("../helpers/nodemailer");
const crypto = require("crypto");
const Registration = require("../models/registrationModel");
const SkillTest = require("../models/skillTestModel");
const Candidate = require("../models/candidateModel");
const Experience = require("../models/experienceModel");
const Project = require("../models/projectModel");
const Education = require("../models/educationModel");
const Certification = require("../models/certificateModel");
const Chat = require("../models/ChatModel");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");

require("dotenv").config();

// authentication controllers
const register = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyWebsite,
      companyIndustry,
      companyDescription,
      companySize,
      companyAddress,
      companyState,
      companyCountry,
    } = req.body;

    const existingCompany = await Company.findOne({ companyEmail });
    if (existingCompany) {
      return res.status(400).json({ error: "Company Already Registered" });
    }

    const newCompanyRegister = new Registration({
      companyName,
      companyEmail,
      companyWebsite,
      companyIndustry,
      companyDescription,
      companySize,
      companyAddress,
      companyState,
      companyCountry,
    });

    await newCompanyRegister.save();
    console.log(newCompanyRegister);
    res.status(201).json({ success: true, message: "Registration Successful" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const signinPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(401).json({ error: "Company not Found" });
    }
    if (password !== company.code) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // const isPasswordMatch = await bcrypt.compare(password, recruiter.password);

    // if (!isPasswordMatch) {
    //   return res.status(401).json({ error: "Invalid email or password" });
    // }

    const token = jwt.sign(
      { userId: company._id, email: company.email, role: company.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successfull",
      company: company,
      token
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const userData = await Company.findOne({ email });
    if (!userData) {
      return res.status(401).json({ message: "Company Account doesn't exist" });
    }
    console.log(userData);
    const resetToken = crypto.randomBytes(20).toString("hex");
    userData.resetToken = resetToken;
    userData.resetTokenExpires = Date.now() + 3600000;
    await userData.save();
    const resetLink = `http://localhost:3000/recruiter/${resetToken}`;

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
  const userData = await Company.findOne({ resetToken: token });
  if (!userData) {
    return res.status(500).json({ message: "Token not found" });
  }
  // const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await Company.updateOne(
      {
        resetToken: token,
      },
      {
        $set: {
          // password: hashedPassword,
          code: password,
          resetToken: undefined,
          resetTokenExpires: undefined,
        },
      }
    );
    res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    console.log(error);
  }
};
const getProfile = async (req, res) => {
  try {
    const companyId = req.user._id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const recruiterIds = company.recruiter.map((recruiter) =>
      recruiter.toString()
    );

    const recruiter = await Recruiter.findOne({
      company: { $in: recruiterIds },
    });

    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }
    
    res.json(recruiter);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// profile controllers
const getCompany = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Recruiter.findById(userId);
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }

    const company = await Company.findById(profile.company);

    res.json(company);
  } catch (error) {
    throw error;
  }
};
const getCompanyDetail = async (req, res) => {
  try {
    const userId = req.user._id;

    const companyDetail = await Company.findById(userId);
    if (!companyDetail) {
      return res.status(404).json({ error: "Company not found" });
    }

    // const company = await Company.findById(profile.company);
    // console.log("company" + company);

    res.json(companyDetail);
  } catch (error) {
    throw error;
  }
};
const saveProfile = async (req, res) => {
  try {
    const { _id, name, email, mobile, designation } = req.body;
    const userId = req.user._id;

    const company = await Company.findById(userId);
    let recruiter;

    // const existingRecruiter = company.recruiter.find(
    //   (recruiter) => recruiter._id === id
    // );
    const existingRecruiter = _id ? await Recruiter.findById(_id) : null;

    if (!existingRecruiter) {
      const newRecruiter = new Recruiter({ name, email, mobile, designation });
      await newRecruiter.save();

      newRecruiter.company = newRecruiter._id;
      await newRecruiter.save();

      company.recruiter.push(newRecruiter._id);
      await company.save();
      recruiter = newRecruiter;
    } else {
      existingRecruiter.name = name;
      existingRecruiter.email = email;
      existingRecruiter.mobile = mobile;
      existingRecruiter.designation = designation;
      await existingRecruiter.save();
      recruiter = existingRecruiter;
    }

    res.status(200).json({ message: "Profile saved successfully", recruiter });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const saveCompany = async (req, res) => {
  const {
    name,
    website,
    email,
    address,
    state,
    country,
    description,
    industry,
    size,
  } = req.body;
  const companyId = req.user._id;

  try {
    let company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    company.name = name;
    company.email = email;
    company.website = website;
    company.address = address;
    company.state = state;
    company.country = country;
    company.description = description;
    company.industry = industry;
    company.size = size;

    await company.save();

    res.status(200).json({ message: "Company information saved successfully" });
  } catch (error) {
    console.error("Error saving company information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Jobs controllers
const jobPost = async (req, res) => {
  try {
    const {
      title,
      numberOfPosts,
      description,
      skillsRequired,
      experienceRequired,
      salary,
      lastDateToApply,
      location,
      jobType,
    } = req.body.jobDetails;
    const { _id } = req.body.quickProfileDetails;
    const company = await Company.findById(_id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, error: "Company not found" });
    }

    const newJob = new Job({
      title,
      numberOfPosts,
      description,
      // skillsRequired: skillsRequired.split(","),
      skillsRequired,
      experienceRequired,
      salary,
      lastDateToApply,
      location,
      jobType,
    });

    await newJob.save();

    company.jobId.push(newJob._id);
    await company.save();

    res.status(201).json({ success: true, message: "Job posted successfully" });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ success: false, error: "Failed to post job" });
  }
};
const getPostedJobs = async (req, res) => {
  try {
    const companyId = req.user._id; // Assuming companyId is stored in req.user
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Retrieve job IDs posted by the company
    const jobIds = company.jobId;

    // Find jobs by IDs
    const jobs = await Job.find({ _id: { $in: jobIds } });

    res.status(200).json({ success: true, postedJobs: jobs });
  } catch (error) {
    console.error("Error fetching posted jobs:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(400).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// skill-test controllers
const createSkillTest = async (req, res) => {
  const { jobId, testName, timeLimit, questions } = req.body;
  const companyId = req.user._id;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job details not found" });
    }

    const newSkillTest = await SkillTest.create({
      testName,
      timeLimit,
      questions,
    });

    job.skillTest = newSkillTest._id;
    company.skillTests.push(newSkillTest._id);
    await Promise.all([job.save(), company.save()]);

    res
      .status(201)
      .json({ success: true, message: "Skill test created successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
const getAllSkillTests = async (req, res) => {
  const companyId = req.user._id;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const skillTestIds = company.skillTests;
    const skillTests = await SkillTest.find({ _id: { $in: skillTestIds } });

    res.status(200).json(skillTests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
const getSkillTestById = async (req, res) => {
  const id = req.params.id;
  try {
    const skillTest = await SkillTest.findById(id);
    if (!skillTest) {
      return res.status(404).json({ message: "Skill test not found" });
    }
    res.status(200).json(skillTest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const assignSkillTest = async (req, res) => {
  const { applicationId, skillTestId } = req.body;

  try {
    const application = await Application.findById(applicationId)
      .populate("jobId")
      .populate("candidateId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Application is not pending for skill test" });
    }
    const skillTestAssignment = new SkillTestAssignment({
      application: applicationId,
      candidate: application.candidateId,
      job: application.jobId,
      skillTest: skillTestId,
    });

    await skillTestAssignment.save();

    application.status = "in-progress";
    await application.save();

    res.status(200).json({ message: "Skill test assigned successfully" });
  } catch (error) {
    console.error("Error assigning skill test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteSkillTest = async (req, res) => {
  const id = req.params.id;
  try {
    const skillTest = await SkillTest.findByIdAndDelete(id);
    if (!skillTest) {
      return res.status(404).json({ message: "Skill test not found" });
    }
    res.status(200).json({ message: "Skill test deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const viewResults = async (req, res) => {
  try {
    const results = await SkillTestAssignment.find()
      .populate({
        path: "skillTest",
        select: "testName",
      })
      .populate({
        path: "application",
        select: "status isAccepted",
      })
      .populate("candidate")
      .lean();
    res.status(200).json(results);
  } catch (error) {
    console.error("Error in viewResults:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// const acceptedTest = async (req, res) => {
//   const { applicationId } = req.body;

//   try {
//     // Update the skill test assignment in the database to mark it as accepted
//     await Application.findByIdAndUpdate(applicationId, { isAccepted: true });

//     // Send a success response
//     res.status(200).json({ message: "Skill test accepted successfully" });
//   } catch (error) {
//     // If an error occurs, send an error response
//     console.error("Error accepting skill test:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
const acceptedTest = async (req, res) => {
  console.log(req.body)
  const { applicationId } = req.body;

  try {
    // Find the application to get companyId and candidateId
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update the skill test assignment in the database to mark it as accepted
    await Application.findByIdAndUpdate(applicationId, { isAccepted: true });

    // Find or create a chat for the company
    let chat = await Chat.findOne({ company: application.companyId });

    if (!chat) {
      chat = new Chat({ company: application.companyId, candidates: [] });
    }

    // Check if the candidate already exists in the chat
    const existingCandidate = chat.candidates.find(
      (candidate) =>
        candidate.candidateId.toString() === application.candidateId.toString()
    );

    if (!existingCandidate) {
      // Add candidateId to the chat
      chat.candidates.push({
        candidateId: application.candidateId,
        messages: [],
      });
      await chat.save();
    }

    // Send a success response
    res.status(200).json({ message: "Skill test accepted successfully" });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error accepting skill test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const rejectedTest = async (req, res) => {
  const { applicationId } = req.body;

  try {
    // Update the skill test assignment in the database to mark it as rejected
    await Application.findByIdAndUpdate(applicationId, { status: "completed" });

    // Send a success response
    res.status(200).json({ message: "Skill test rejected successfully" });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error rejecting skill test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// applications controllers
const getApplications = async (req, res) => {
  const { id } = req.params;
  try {
    const companyId = req.user._id;

    const applications = await Application.find({ companyId, jobId: id });

    const candidateIds = applications.map((app) => app.candidateId);

    const candidates = await Candidate.find({ _id: { $in: candidateIds } });

    res.status(200).json({ applications, candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const acceptedApplications = async (req, res) => {
  try {
    // Find applications where isAccepted is true and populate the candidate details
    const acceptedApps = await Application.find({ isAccepted: true }).populate(
      "candidateId"
    );
    // Send the accepted applications in the response
    res.status(200).json({ acceptedApplications: acceptedApps });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error fetching accepted applications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const rejectedApplications = async (req, res) => {
  try {
    // Find applications where isRejected is true and populate the candidate details
    const rejectedApps = await Application.find({
      status: "completed",
    }).populate("candidateId");
    // Send the rejected applications in the response
    res.status(200).json({ rejectedApplications: rejectedApps });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error fetching rejected applications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getApplicant = async (req, res) => {
  const { id } = req.params;
  try {
    const applicantDetails = await Candidate.findById(id);
    const status = await Application.find({ candidateId: id });

    if (!applicantDetails) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const educationDetails = await Education.find({
      _id: { $in: applicantDetails.educationId },
    });
    const experienceDetails = await Experience.find({
      _id: { $in: applicantDetails.experienceId },
    });
    const projectDetails = await Project.find({
      _id: { $in: applicantDetails.projectId },
    });
    const certificationDetails = await Certification.find({
      _id: { $in: applicantDetails.certificationId },
    });
    res.status(200).json({
      status,
      applicantDetails,
      educationDetails,
      experienceDetails,
      projectDetails,
      certificationDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// chat controllers
const getCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findById(id);
    if (candidate) {
      res.json(candidate);
    } else {
      res.status(404).json({ message: "Candidate not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getCandidates = async (req, res) => {
  try {
    // Fetch all unique candidate IDs from the chat records
    const chatCandidates = await Chat.distinct("candidates.candidateId");

    const candidates = await Candidate.find({ _id: { $in: chatCandidates } });

    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching chat candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const sendMessage = async (req, res) => {
  try {
    const recruiterId = req.user._id; // Assuming companyId is recruiterId
    const { candidateId } = req.params;
    const { content, sender, files } = req.body;

    // Find or create the chat between recruiter and candidate
    let chat = await Chat.findOne({
      company: recruiterId,
      "candidates.candidateId": candidateId,
    });

    if (!chat) {
      // If chat doesn't exist, create a new one
      chat = new Chat({
        company: recruiterId,
        candidates: [{ candidateId }],
      });
    }

    // Find the candidate chat object within the chat
    let candidateChat = chat.candidates.find(
      (candidate) => candidate.candidateId.toString() === candidateId.toString()
    );

    if (!candidateChat) {
      // If candidate chat doesn't exist, create a new one
      candidateChat = {
        candidateId,
        messages: [],
      };
      chat.candidates.push(candidateChat);
    }

    // Add new message to candidate's chat
    const newMessage = new Message({
      content,
      sender,
      files: files?.map((file) => file.filename),
      timestamp: new Date(), // Set the creation date and time
    });
    // Save the new message
    const savedMessage = await newMessage.save();

    // Push the ID of the saved message to candidate's chat
    candidateChat.messages.push(savedMessage._id);

    // Save the updated chat
    await chat.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getMessagesWithCandidate = async (req, res) => {
  const recruiterId = req.user._id; // Assuming recruiterId is available in req.user._id
  const { candidateId } = req.params;

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

    // Retrieve messages directly from the Message model using IDs stored in the Chat model
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

    console.log(formattedMessages);
    res.status(200).json(formattedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// notification controllers
const sendNotification = async (req, res) => {
  const { recipient, message } = req.body;
  try {
    await Notification.create({ recipient, message });
    res.status(200).json({ success: true, message: "Notification sent" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  register,
  signinPost,
  forgotPassword,
  resetPasssword,
  getProfile,
  getCompany,
  getCompanyDetail,
  saveProfile,
  saveCompany,
  jobPost,
  getPostedJobs,
  getJobById,
  createSkillTest,
  getAllSkillTests,
  getSkillTestById,
  assignSkillTest,
  deleteSkillTest,
  viewResults,
  acceptedTest,
  rejectedTest,
  getApplications,
  acceptedApplications,
  rejectedApplications,
  getApplicant,
  sendMessage,
  getCandidate,
  getCandidates,
  getMessagesWithCandidate,
  sendNotification,
  logout,
};
