const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  size: {
    type: String,
    // required: true,
  },
  email:{
    type:String,
    // required:true
  },
  jobId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  industry: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  website: {
    type: String,
    // required:true
  },
  address: {
   type:String,
  //  required:true
  },
  state: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
  },
  logo: {
    type: String,
    // required: true,
  },
  code:{
    type: String,
    // required: true,
  },
  role:{
    type:String,
    default:"company"
  },
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenExpires: {
    type: Date,
    default: "",
  },
  isBlocked: { type: Boolean, default: false },
  recruiter: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
    },
  ],
  skillTests:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillTest",
    }
  ]
});
const Company = mongoose.model("Company", companySchema);
module.exports = Company;
