const User = require("../models/user.model");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const isOtpExpired = (otpExpiry) => {
  return new Date() > new Date(otpExpiry);
};

const cleanUpExpiredOtp = async (email) => {
  try {
    await User.findOneAndUpdate(
      { email, otpExpiresAt: { $lte: new Date() } },
      { $unset: { otp: 1, otpCreatedAt: 1, otpExpiry: 1 } }
    );
    // console.log("Expired OTP removed for:", email);
  } catch (error) {
    console.error("Error removing expired OTP for", email, ":", error);
  }
};

module.exports = { generateOTP, cleanUpExpiredOtp, isOtpExpired };
