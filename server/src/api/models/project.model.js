const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String] },
  start_date: { type: Date },
  end_date: { type: Date },
  url: { type: String },
  github_url: { type: String },
});

module.exports = mongoose.model("Project", projectSchema);
