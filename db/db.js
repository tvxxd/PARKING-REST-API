const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
const { execQuery } = require("../utils");

// db connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) console.log(err);
  console.log("connection successful");

  /* Tables for users,cars,parking zones/history
  and execute creation */

  const createUser = `
CREATE TABLE IF NOT EXISTS users (
    user_id integer PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(25) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance integer DEFAULT 100,
    is_admin BOOLEAN DEFAULT false
  )
`;

  const createCars = `
CREATE TABLE IF NOT EXISTS cars (
    car_id int PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL,
    car_name varchar(50) NOT NULL,
    car_number varchar(50) NOT NULL UNIQUE,
    car_type varchar(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )
`;

  const createParkingZones = `
CREATE TABLE IF NOT EXISTS parking_zones (
    parking_id integer PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL UNIQUE,
    address varchar(50) NOT NULL,
    hourly_cost integer NOT NULL,
    user_id integer NOT NULL,
    car_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id)
  )
`;

  const createParkingHistory = `
CREATE TABLE IF NOT EXISTS parking_history (
    id integer PRIMARY KEY AUTO_INCREMENT,
    user_id integer NOT NULL,
    car_id integer NOT NULL,
    parking_id integer NOT NULL,
    register_time DATETIME NOT NULL,
    duration integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id),
    FOREIGN KEY (parking_id) REFERENCES parking_zones(parking_id)
  )
`;

  const tables = [
    { name: "users", query: createUser },
    { name: "cars", query: createUser },
    { name: "parking_zones", query: createUser },
    { name: "parking_history", query: createUser },
  ];
  for (const e of tables) {
    execQuery(db, e.query)
      .then(() => {
        console.log(`success ${e.name}`);
      })
      .catch((err) => {
        throw err;
      });
  }
});

module.exports = db;
