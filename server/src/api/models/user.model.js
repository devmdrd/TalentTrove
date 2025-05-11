const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  mobile: { type: String },
  role: {
    type: String,
    enum: ["admin", "user", "company"],
    default: "company",
  },
  isBlocked: { type: Boolean, default: false },
  online: { type: Boolean, default: false },

  candidateProfile: {
    about: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: String },
    profilePicture: { type: String },
    resumeOrCv: { type: String },
    skills: [{ name: { type: String, required: true } }],
    languages: [
      {
        name: { type: String },
        proficiency: {
          type: String,
          enum: ["Native", "Fluent", "Intermediate", "Beginner"],
          default: "Fluent",
        },
      },
    ],
    educationsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    experiencesId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
    projectsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    certificationsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    googleId: { type: String, unique: true },
  },

  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

  resetToken: { type: String, default: "" },
  resetTokenExpiry: { type: Date },
  otp: { type: String, default: "" },
  otpExpiry: { type: Date, default: null },
  otpCreatedAt: { type: Date, default: Date.now },
});

userSchema.index(
  { 'candidateProfile.googleId': 1 },
  { unique: true, partialFilterExpression: { 'candidateProfile.googleId': { $ne: null } } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
