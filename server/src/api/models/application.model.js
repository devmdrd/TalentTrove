const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ['pending', 'in-progress', 'accepted', 'rejected'], default: 'pending' },
  isTestCompleted: { type: Boolean, default: false },
  coverLetter: { type: String, default: '' },
  skillTestScore: { type: Number, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
