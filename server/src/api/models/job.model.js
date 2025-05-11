const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  numberOfPosts: { type: Number, required: true, min: 1 },
  description: { type: String, required: true },
  skillsRequired: { type: [String], required: true },
  experienceRequired: { type: String, required: true },
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  lastDateToApply: { type: Date, required: true },
  location: { type: String, required: true, index: true },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']
  },
  skillTest: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillTest' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
