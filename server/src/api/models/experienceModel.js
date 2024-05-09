const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  companyName: {
    type: String,
    // required: true,
  },
  yearsOfExperience: {
    type: Number,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
});

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;
