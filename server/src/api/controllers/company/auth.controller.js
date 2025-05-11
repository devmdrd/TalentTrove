const User = require("../../models/user.model.js");
const Company = require("../../models/company.model.js");
const { generateToken, verifyToken } = require("../../utils/token.util.js");
const { sendPasswordResetEmail } = require("../../services/nodemailer.service.js");
const { hashPassword, comparePassword } = require("../../utils/password.util.js");

const signup = async (req, res) => {
  try {
    const { name, email, website, industry, description, size, address, state, country } = req.body;

      if (!name || !email) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
    }
    
    if (!website || !industry || !description || !size || !address || !state || !country) {
      return res.status(400).json({ error: "Missing required fields for company information" });
    }

      const newCompany = new Company({
          website,
          address,
          state,
          country,
          industry,
          description,
          size,
      });

      await newCompany.save();

      const newUser = new User({
          name,
          email,
          role: "company",
          company: newCompany._id,
      });

      await newUser.save();
      res.status(200).json({ success: true, message: "Signup successful" });
  } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || user.role !== "company") {
      return res.status(401).json({ error: "Account does not exist" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account is blocked. Contact support." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user.online = true;
    await user.save();

    const token = generateToken(user._id, user.role, process.env.ACCESS_TOKEN_SECRET, "1h");

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
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
    if (!user || user.role !== "company") {
      return res.status(404).json({ message: "Recruiter account doesn't exist" });
    }

    const resetToken = generateToken(user._id, "company", process.env.ACCESS_TOKEN_SECRET, "1h");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; 
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/company/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (error) {
    console.error("Forgot password error:", error);
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
    console.error("Reset password error:", error);
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
  signup,
  signin,
  forgotPassword,
  resetPassword,
  logout,
};
