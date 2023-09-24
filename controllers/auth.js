const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const { unAuthorizedErr, badRequestErr } = require("../errors/errors");
const { StatusCodes } = require("http-status-codes");

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
    db.query(checkUser, [username, email], async (err, results) => {
      if (err) {
        throw err;
      }

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
      const insertUser = `
    INSERT INTO users (username, email, password) 
    VALUES (?, ?, ?)
  `;
      db.query(insertUser, [username, email, hashedPW], (err, result) => {
        if (err) {
          throw new badRequestErr("registration failed");
        }
        res
          .status(StatusCodes.OK)
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
const login = async (req, res) => {};

module.exports = {
  register,
  login,
};
