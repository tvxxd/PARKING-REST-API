const { StatusCodes } = require("http-status-codes");
const {
  unAuthorizedErr,
  badRequestErr,
  notFoundErr,
  apiError,
} = require("../errors/errors");
const db = require("../db/db");

const getAllParkingZones = async (req, res) => {
  try {
    const userId = req.user?.user_id;

    const checkAdmin = `SELECT is_admin FROM users WHERE user_id = ?`;
    db.query(checkAdmin, [userId], async (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length === 0) {
        throw new notFoundErr("user not found");
      }

      const user = result[0];

      if (!req.user.is_admin) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "only admins" });
      }

      const query = "SELECT * FROM parking_zones";
      db.query(query, (err, result) => {
        if (err) {
          throw err;
        }

        res.status(StatusCodes.OK).json(result);
      });
    });
  } catch (error) {
    if (error instanceof apiError) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    } else if (error instanceof notFoundErr) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    } else if (error instanceof unAuthorizedErr) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to fetch parking zones" });
    }
  }
};
const getParkingZone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    const checkAdmin = `SELECT is_admin FROM users WHERE user_id = ?`;
    db.query(checkAdmin, [userId], async (err, result) => {
      if (err) {
        throw err;
      }

      const user = result[0];

      if (!req.user.is_admin) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "only admins" });
      }

      const query = "SELECT * FROM parking_zones WHERE parking_id = ?";
      db.query(query, [id], (err, result) => {
        if (err) {
          throw new apiError("Failed to fetch parking zone");
        }

        if (result.length === 0) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: `zone not found ${id} ` });
        }

        res.status(StatusCodes.OK).json(result[0]);
      });
    });
  } catch (error) {
    console.error(error);
    if (error instanceof apiError) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    } else if (error instanceof notFoundErr) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    } else if (error instanceof unAuthorizedErr) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to fetch parking zone" });
    }
  }
};
const createParkingZone = async (req, res) => {
  try {
    // Check if the user is an admin
    const userId = req.user?.user_id; // Assuming you have user information in the request
    // Query the database to check if the user is an admin
    const checkAdminQuery = `SELECT is_admin FROM users WHERE user_id = ?`;
    db.query(checkAdminQuery, [userId], async (err, result) => {
      if (err) {
        throw new apiError("Database error");
      }
      const user = result[0];

      if (!req.user.is_admin) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "only admins" });
      }

      const { name, address, hourly_cost } = req.body;
      // check if parking exist
      const checkParkingZone = `SELECT name,address FROM parking_zones WHERE name = ? OR address = ?`;
      db.query(
        checkParkingZone,
        [name, address, hourly_cost],
        (err, result) => {
          if (err) {
            throw err;
          }
          if (!name || !address || !hourly_cost) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: "fill in the fields" });
          }
          if (result.length > 0) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: "parking exists" });
          }

          const query = `INSERT INTO parking_zones(name,address,hourly_cost) VALUES(?,?,?)`;
          db.query(query, [name, address, hourly_cost], (err, result) => {
            if (err) {
              throw err;
            }
            res
              .status(StatusCodes.CREATED)
              .json({ message: "parking zone created" });
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    if (error instanceof apiError) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    } else if (error instanceof notFoundErr) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    } else if (error instanceof unAuthorizedErr) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "creation failed" });
    }
  }
};
const updateParkingZone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const updatedParkingZone = req.body;

    const checkAdmin = `SELECT is_admin FROM users where user_id = ?`;
    db.query(checkAdmin, [userId], async (err, result) => {
      if (err) {
        throw err;
      }
      const user = result[0];
      if (!req.user.is_admin) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "only admins" });
      }

      const checkParkingZone =
        "SELECT * FROM parking_zones WHERE parking_id = ?";
      db.query(checkParkingZone, [id], async (err, result) => {
        if (err) {
          throw err;
        }

        if (result.length === 0) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "zone not found" });
        }
        const updateZone = "UPDATE parking_zones SET ? WHERE parking_id = ?";
        db.query(updateZone, [updatedParkingZone, id], (err) => {
          if (err) {
            throw err;
          }
          res.status(StatusCodes.OK).json({ message: "zone updated" });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed" });
  }
};
const deleteParkingZone = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const checkAdmin = `SELECT is_admin FROM users where user_id = ? `;
    db.query(checkAdmin, [userId], async (err, result) => {
      if (err) {
        throw err;
      }
      const user = result[0];
      if (!req.user.is_admin) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "only admins" });
      }
      const checkParkingZone =
        "SELECT * FROM parking_zones WHERE parking_id = ?";

      db.query(checkParkingZone, [id], async (err, result) => {
        if (err) {
          throw err;
        }
        if (result.length === 0) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "zone not found" });
        }

        const deleteParkingZone = `DELETE FROM parking_zones WHERE parking_id = ?`;
        db.query(deleteParkingZone, [id], async (err, result) => {
          if (err) {
            throw err;
          }
          res.status(StatusCodes.OK).json({ message: "zone deleted !" });
        });
      });
    });
  } catch (error) {
    if (error instanceof apiError) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    } else if (error instanceof notFoundErr) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    } else if (error instanceof unAuthorizedErr) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "delete failed" });
    }
  }
};

const getAllParkingHistory = async (req, res) => {
  try {
    const userId = req.user.is_admin;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "admins only." });
    }

    const query = `SELECT * FROM parking_car;`;

    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      res.status(StatusCodes.OK).json(result);
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "fetch failed" });
  }
};

module.exports = {
  getParkingZone,
  getAllParkingZones,
  createParkingZone,
  updateParkingZone,
  deleteParkingZone,
  getAllParkingHistory,
};
