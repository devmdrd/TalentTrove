const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.model");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.isBlocked || user.role !== decoded.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = verifyToken;
