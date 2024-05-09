const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  about: {
    type: String,
    // required: true,
  },
  dateOfBirth: {
    type: Date,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  mobile: {
    type: Number,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  educationId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
    },
  ],
  experienceId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
  skills: {
    type: [String],
  },
  languages: [
    {
      name: {
        type: String,
        // required: true
      },
      proficiency: { type: String, default: "fluent" },
    },
  ],
  projectId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  certificationId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certification",
    },
  ],
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenExpires: {
    type: Date,
    default: "",
  },
  profilePicture: {
    type: String,
    // required: true,
  },
  resumeOrCv: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    default: "candidate",
  },
  otp: {
    type: String,
    default: "",
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  otpCreatedAt: {
    type: Date,
    default: Date.now,
  },
  googleId: {
    type: String,
    // required: true
  },
  online: {
    type: Boolean,
    default: false, // Default to offline
  },
  isBlocked: { type: Boolean, default: false },
});

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
