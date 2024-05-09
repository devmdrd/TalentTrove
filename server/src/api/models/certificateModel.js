const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  organization: {
    type: String,
    // required: true,
  },
  year: {
    type: Number,
    // required: true,
  },
});

const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;
