const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    // required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    // required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    // required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending', 
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application;
