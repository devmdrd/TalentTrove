const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  field_of_study: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  is_currently_studying: { type: Boolean, default: false },
  description: { type: String },
});

module.exports = mongoose.model("Education", educationSchema);
