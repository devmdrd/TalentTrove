const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for SkillTestAssignment
const skillTestAssignmentSchema = new Schema({
  application: {
    type: Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  candidate: { type: Schema.Types.ObjectId, ref: "Candidate", required: true },
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  skillTest: { type: Schema.Types.ObjectId, ref: "SkillTest", required: true },
  score:{
    type:String,
    // required:true
  },
  assignedAt: { type: Date, default: Date.now },
});

// Create SkillTestAssignment model
const SkillTestAssignment = mongoose.model(
  "SkillTestAssignment",
  skillTestAssignmentSchema
);

module.exports = SkillTestAssignment;
