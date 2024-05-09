const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    // required: true,
  },
  companySize: {
    type: String,
    // required: true,
  },
  companyEmail: {
    type: String,
    // required: true,
  },
  companyIndustry: {
    type: String,
    // required: true,
  },
  companyDescription: {
    type: String,
    // required: true,
  },
  companyWebsite: {
    type: String,
    // required: true,
  },
  companyAddress: {
    type: String,
    // required: true,
  },
  companyState: {
    type: String,
    // required: true,
  },
  companyCountry: {
    type: String,
    // required: true,
  },
  companyLogo: {
    type: String,
    // required: true,
  },
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
