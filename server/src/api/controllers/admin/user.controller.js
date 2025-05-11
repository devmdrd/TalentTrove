const User = require("../../models/user.model");

const manageUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: `User has been ${isBlocked ? "blocked" : "unblocked"}.`,
      user,
    });
  } catch (error) {
    console.error("Error managing user:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find({role: "user"});

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { manageUser, listUsers };
