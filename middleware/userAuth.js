const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userMiddleware = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = {
      user_id: tokenDecoded.user_id,
    };
    next();
  } catch (error) {
    throw error;
  }
};

module.exports = userMiddleware;
