const jwt = require("jsonwebtoken");

const generateToken = (userId, role, secretKey, expiresIn) => {
  return jwt.sign({ userId, role }, secretKey, { expiresIn });
};

const verifyToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Token is invalid or expired");
  }
};

module.exports = { generateToken, verifyToken };
