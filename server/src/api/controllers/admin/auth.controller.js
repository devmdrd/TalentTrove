const User = require("../../models/user.model");
const { hashPassword, comparePassword } = require("../../utils/password.util");
const { generateToken } = require("../../utils/token.util");

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user || user.role !== "admin")
      return res.status(401).json({ success: false, message: "Account does not exist." });

    const isPasswordValid = await comparePassword(password, user.password.replace("$2y$", "$2b$"));

    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Invalid email or password." });

    user.online = true;
    await user.save();

    const token = generateToken(user._id, user.role, process.env.ACCESS_TOKEN_SECRET, "1h");
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, online: user.online },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const logout = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user._id }, { online: false });
    res.status(200).json({ success: true, message: "Admin logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { signin, logout };
