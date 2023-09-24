const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const {
  unAuthorizedErr,
  badRequestErr,
  notFoundErr,
} = require("../errors/errors");
const { StatusCodes } = require("http-status-codes");
const notFound = require("../middleware/notFound");

/*
REGISTER
hash pw
check if user exists
insert user into db
response
*/

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // hash pw (generate bunch of bullshit)
    const hashedPW = await bcrypt.hash(password, 10);

    // this checks if the user exists
    const checkUser = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.query(checkUser, [username, email], (err, results) => {
      if (err) {
        throw err;
      }
      if (!username || !email || !password) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "fill in the fields" });
      } else if (password.length < 8)
        return res.json({ message: "password must be minimum 8 characters" });
      if (results.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "user exists brotha" });
      }
      const emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!emailRegEx.test(email)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "input valid email" });
      }
      // insert into db
      const insertUser = `INSERT INTO users (username, email, password) VALUES(?, ?, ?)`;
      db.query(insertUser, [username, email, hashedPW], (err, result) => {
        if (err) {
          throw new badRequestErr("registration failed");
        }
        res
          .status(StatusCodes.CREATED)
          .json({ message: "successful registration bro" });
      });
    });
  } catch (error) {
    console.log(error);
    if (error instanceof badRequestErr) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "registration failed bro" });
    }
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const selectUser = `SELECT username,password FROM users WHERE username = ?`;
    db.query(selectUser, [username, password], async (err, result) => {
      if (err) {
        throw new badRequestErr("login failed");
      }
      if (result.length === 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "login failed, user not found" });
      }
      // receive password to compare hashed passw
      const user = result[0];
      const comparison = await bcrypt.compare(password, user.password);
      if (comparison) {
        // json token required
        res.status(StatusCodes.OK).json({ message: 'loggedin' });
      } else {
        throw new unAuthorizedErr("invalid username or password");
      }
    });
  } catch (error) {
    console.log(error);
    if (error instanceof unAuthorizedErr) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "login failed bro" });
    }
  }
};

module.exports = {
  register,
  login,
};
