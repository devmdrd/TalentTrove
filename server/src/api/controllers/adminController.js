const Recruiter = require("../models/recruiterModel");
const Company = require("../models/companyModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Registration = require("../models/registrationModel");
const Candidate = require("../models/candidateModel");
require("dotenv").config();

// fn -> GENRATE_TOKEN
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, "process.env.ACCESS_TOKEN_SECRET", {
    expiresIn: "1h",
  });
};

// auth controllers
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken(admin._id, admin.role);
    
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server error" });
  }
};

// Recruiters Controllers
const getRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find();
    res.json({ recruiters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getCompany = async (req, res) => {
  const { recruiterId } = req.query;
  try {
    if (recruiterId) {
      const recruiter = await Recruiter.findById(recruiterId);
      if (!recruiter) {
        return res.status(404).json({ error: "Recruiter not found" });
      }

      const companyIds = recruiter.company;
      const companyDetails = await Company.find({ _id: { $in: companyIds } });

      if (!companyDetails || companyDetails.length === 0) {
        return res.status(404).json({ error: "No companies found" });
      }

      return res.status(200).json({ companyDetails });
    } else {
      const allCompanies = await Registration.find();
      if (!allCompanies || allCompanies.length === 0) {
        return res.status(404).json({ error: "No companies found" });
      }

      return res.status(200).json({ allCompanies });
    }
  } catch (err) {
    console.error("Error fetching company:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const registerCompany = async (req, res) => {
 
  try {
    const { email, password } = req.body;
    const {companyName, companySize, companyEmail, companyIndustry, companyDescription, companyWebsite, companyAddress, companyState, companyCountry} = req.body.details;

    const existingCompany = await Company.findOne({ email });
    console.log(existingCompany)

    if (existingCompany) {
      return res.status(400).json({ error: "Company Already Exists" });
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = new Company({
      name: companyName,
      size: companySize,
      email: companyEmail,
      industry: companyIndustry,
      description: companyDescription,
      website: companyWebsite,
      address: companyAddress,
      state: companyState,
      country: companyCountry,
      // code:hashedPassword
      code:password
    });

    await newCompany.save();

    res.status(201).json({ success:true, message: "Company created successfully" });
  } catch (error) {
    console.error("Error in company creation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const blockRecruiter = async (req, res) => {
  const { recruiterId } = req.params;
  console.log(recruiterId);
  try {
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    recruiter.isBlocked = !recruiter.isBlocked;
    await recruiter.save();
    res.json({ success: true, recruiter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json({ candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const blockCandidate = async (req, res) => {
  const { candidateId } = req.params;
  console.log(candidateId);
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    candidate.isBlocked = !candidate.isBlocked;
    await candidate.save();
    res.json({ success: true, candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const signout = async (req, res) => {
  try {
    res.json({ messsage: "Logout succesfull" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  signin,
  getRecruiters,
  getCompany,
  registerCompany,
  blockRecruiter,
  getCandidates,
  blockCandidate,
  signout,
};
