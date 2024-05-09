const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    // required: true,
  },
  institution: {
    type: String,
    // required: true,
  },
  year: {
    type: Number,
    // required: true,
  },
});

const Education = mongoose.model("Education", educationSchema);

module.exports = Education;
