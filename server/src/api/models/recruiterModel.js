const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  mobile: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  company:{
    type:String,
    // required:true
  },
  designation: {
    type: String,
    // required:true
  },
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenExpires: {
    type: Date,
    default: "",
  },
  role: {
    type: String,
    default: "recruiter",
  },
  isBlocked: { type: Boolean, default: false }
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);

module.exports = Recruiter;
