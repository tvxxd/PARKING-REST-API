const { StatusCodes } = require("http-status-codes");
const {
  unAuthorizedErr,
  badRequestErr,
  notFoundErr,
  apiError,
} = require("../errors/errors");
const db = require("../db/db");

const addCar = async (req, res) => {
  try {
    const { car_name, car_number, car_type } = req.body;
    // to avoid multiple entries with spacebars
    req.body.car_name = car_name.trim();
    req.body.car_number = car_number.trim();

    // pattern XX-000-YY
    const numberRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;
    const userId = req.user.user_id;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "not authenticated" });
    }

    const checkCar = `SELECT * FROM cars WHERE car_number = ? AND user_id = ?`;

    db.query(checkCar, [car_number, userId], (err, result) => {
      if (err) {
        throw err;
      }
      if (!numberRegex.test(req.body.car_number)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "number format must be XX-000-YY like this" });
      }
      if (!car_name || !car_number || !car_type) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "fill in the fields" });
      }
      if (result.length > 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "this car exists" });
      }

      const query = `INSERT INTO cars(car_name, car_number, car_type, user_id) VALUES(?,?,?,?)`;
      db.query(
        query,
        [car_name, car_number, car_type, userId],
        (err, result) => {
          if (err) {
            throw err;
          }
          res.status(StatusCodes.CREATED).json({ message: "car created" });
        }
      );
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
const getCar = async (req, res) => {
  try {
    const { id } = req.params;
    const carId = req.user.car_id;

    const query = "SELECT * FROM cars WHERE  car_id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        throw error;
      }
      if (result.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: `car not found with id: ${id} ` });
      }
      res.status(StatusCodes.OK).json(result[0]);
    });
  } catch (error) {
    throw error;
  }
};
const getCars = async (req, res) => {
  try {
    const query = "SELECT * FROM cars";
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length === 0) {
        throw new notFoundErr("car not found");
      }

      res.status(StatusCodes.OK).json(result);
    });
  } catch (error) {
    throw error;
  }
};
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const { car_name, car_number, car_type } = req.body;

    const query = "SELECT * FROM cars WHERE car_id = ? AND user_id = ?";
    db.query(query, [id, userId], (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      if (result.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: `car not found with id: ${id} or it's not yours ` });
      }

      const updateCar = `UPDATE cars SET car_name = ?, car_number = ?, car_type = ? WHERE car_id = ?`;
      db.query(updateCar, [car_name, car_number, car_type, id], (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
        res.status(StatusCodes.OK).json({ message: "car updated !" });
      });
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed" });
  }
};
const deleteCar = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    const query = `SELECT * FROM cars WHERE car_id = ? AND user_id = ?`;
    db.query(query, [id, userId], (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      if (result.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: `car not found with id: ${id} or it's not yours ` });
      }

      const deleteTheCar = `DELETE FROM cars WHERE car_id = ?`;
      db.query(deleteTheCar, [id], (err, result) => {
        if (err) {
          console.log(err);
          throw err;
        }
        res.status(StatusCodes.OK).json({ message: "car deleted" });
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "failed to delete car" });
  }
};

const addCarToParkingZone = async (req, res) => {
  try {
    const { user_id, parking_id, car_id } = req.params;

    // this checks multiple entries and if zone is occupied
    const checkaddedZones = `
      SELECT *
      FROM parking_car
      WHERE user_id = ? AND parking_id = ? AND car_id = ?
    `;
    db.query(checkaddedZones, [user_id, parking_id, car_id], (err, result) => {
      if (err) {
        throw err;
      }

      if (parking_id)
        if (result.length > 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "this parking zone is reserved.",
          });
        }
      const checkParkingZone =
        "SELECT * FROM parking_zones WHERE parking_id = ?";
      db.query(checkParkingZone, [parking_id], (err, result) => {
        if (err) {
          throw err;
        }

        if (result.length > 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "zone is occupied.",
          });
        }
        if (result.length === 0) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "zone not found" });
        }

        const checkCar = "SELECT * FROM cars WHERE car_id = ?";
        db.query(checkCar, [car_id], (err, result) => {
          if (err) {
            throw err;
          }

          if (result.length === 0) {
            return res
              .status(StatusCodes.NOT_FOUND)
              .json({ message: "car not found" });
          }

          const register_time = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          const duration = 0;

          const addCarToParking =
            "INSERT INTO parking_car (user_id, parking_id, car_id, register_time, duration) VALUES (?, ?, ?, ?, ?)";
          db.query(
            addCarToParking,
            [req.user.user_id, parking_id, car_id, register_time, duration],
            (err) => {
              if (err) {
                console.log(err);
              }
              res
                .status(StatusCodes.CREATED)
                .json({ message: "car added to zone " });
            }
          );
        });
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "failed to add car to ozone" });
  }
};

module.exports = {
  addCar,
  getCar,
  getCars,
  updateCar,
  deleteCar,
  addCarToParkingZone,
};
