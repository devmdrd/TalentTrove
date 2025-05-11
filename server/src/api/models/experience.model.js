const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company_name: { type: String, required: true },
  employment_type: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
    required: true,
  },
  location: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  is_currently_working: { type: Boolean, default: false },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Experience", experienceSchema);
