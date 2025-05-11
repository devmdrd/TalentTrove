const User = require("../../models/user.model.js");
const { generateOTP, isOtpExpired, cleanUpExpiredOtp } = require("../../utils/otp.util.js");
const { generateToken, verifyToken } = require("../../utils/token.util.js");
const { sendOTPByEmail, sendPasswordResetEmail } = require("../../services/nodemailer.service.js");
const { hashPassword, comparePassword } = require("../../utils/password.util.js");

const googleCallback = async (req, res) => {
  try {
    const { profile, isSignup } = req.user;
    let user = await User.findOne({ $or: [{ "candidateProfile.googleId": profile.id }, { email: profile.emails[0].value }] });

    if (user) {
      if (isSignup) {
        return res.redirect(`${process.env.CLIENT_URL}/signin?error=Account already exists`);
      }

      const token = generateToken(user.id, user.role, process.env.ACCESS_TOKEN_SECRET, "1h");
      return res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
    }

    if (!isSignup) {
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=User not found`);
    }

    user = new User({
      candidateProfile: {
        googleId: profile.id, 
      },
      name: profile.displayName,
      email: profile.emails[0].value,
    });
    await user.save();

    return res.redirect(`${process.env.CLIENT_URL}/signin?message=Account created successfully`);
  } catch (error) {
    console.error("Google callback error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/signin?error=Internal server error`);
  }
};

const signup = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otpCode = generateOTP();
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      role: "user",
      otp: otpCode,
      otpCreatedAt: new Date(),
      otpExpiry: new Date(Date.now() + 1 * 60 * 1000),
    });

    await newUser.save();
    await sendOTPByEmail(email, otpCode);

    setTimeout(() => cleanUpExpiredOtp(email), 60 * 1000); 

    res.status(200).json({ message: "OTP sent for verification" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const newOTP = generateOTP();
    user.otp = newOTP;
    user.otpCreatedAt = new Date();
    user.otpExpiry = new Date(Date.now() + 1 * 60 * 1000);
    await user.save();

    await sendOTPByEmail(email, newOTP);

    setTimeout(() => cleanUpExpiredOtp(email), 60 * 1000);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ error: "Error resending OTP" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpString = otp.join("");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp && !isOtpExpired(user.otpExpiry)) {
      if (user.otp === otpString) {
        user.otp = "";
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({ success: true, message: "OTP verified" });
      } else {
        return res.status(400).json({ error: "Invalid OTP" });
      }
    } else {
      return res.status(400).json({ error: "OTP expired or not available" });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ error: "Account does not exist" });

    if (user.isBlocked) {
      return res.status(403).json({
        error: "Your account is blocked. Contact support.",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    user.online = true;
    await user.save();

    const token = generateToken(user._id, user.role, process.env.ACCESS_TOKEN_SECRET, "1h");

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Account doesn't exist" });
    }

    const resetToken = generateToken(user._id, "user", process.env.ACCESS_TOKEN_SECRET, "1h");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  
  try {
    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ resetToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const hashedPassword = await hashPassword(password);
    await User.updateOne(
      { resetToken: token },
      { $set: { password: hashedPassword, resetToken: undefined, resetTokenExpiry: undefined } }
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.updateOne({ _id: userId }, { online: false });
    res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  googleCallback,
  signup,
  resendOtp,
  verifyOTP,
  signin,
  forgotPassword,
  resetPassword,
  logout,
};