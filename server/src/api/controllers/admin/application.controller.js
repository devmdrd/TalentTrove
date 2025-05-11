const User = require("../../models/user.model");
const { sendPasswordEmail } = require("../../services/nodemailer.service");
const { hashPassword } = require("../../utils/password.util.js");

const manageApplication = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User account doesn't exist." });
    }

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    await user.save();

    await sendPasswordEmail(email, password);

    res.status(200).json({ success: true, message: "Password email sent successfully." });
  } catch (error) {
    console.error("Error sending password email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { manageApplication };
