const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const unAuthorizedErr = require('../errors/unauthorized');
require('dotenv').config()

const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
  
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_KEY);
    const isUserAdmin = tokenDecoded.is_admin
    if(!isUserAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'permission denied' })
    }
} catch (error) {
    console.log(error)
  }
};

module.exports = adminMiddleware;
