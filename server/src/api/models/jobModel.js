const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  numberOfPosts: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  experienceRequired: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  lastDateToApply: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  skillTest: {
    type: String,
    // required:true
  },
  isApplied: {
    type: Boolean,
    default: false,
  }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
