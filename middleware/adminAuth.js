const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const unAuthorizedErr = require('../errors/unauthorized');
require('dotenv').config()


const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization").split(' ')[1];
  
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
  
  try {
    const tokenDecoded = jwt.verify(token,process.env.JWT_KEY);
    req.user = {
      user_id: tokenDecoded.user_id,
      is_admin: tokenDecoded.is_admin
    }
    const isUserAdmin = tokenDecoded.is_admin
    if(!isUserAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'permission denied' })
    }
    next();
} catch (error) {
    console.log(error)
  }
};

module.exports = adminMiddleware;
