const jwt = require("jsonwebtoken");
require("dotenv").config();
const Candidate = require("../models/candidateModel");
// const Recruiter = require("../models/recruiterModel");
const Admin = require("../models/adminModel");
const Company = require("../models/companyModel");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let user;
    switch (decoded.role) {
      case "candidate":
        user = await Candidate.findById(decoded.userId);
        break;
      case "admin":
        user = await Admin.findById(decoded.userId);
        break;
      case "company":
        user = await Company.findById(decoded.userId);
        break;
      default:
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Check if the user is blocked
    if (user.isBlocked) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = verifyToken;
