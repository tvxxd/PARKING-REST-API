const { StatusCodes } = require("http-status-codes");

const getAllParkingZones = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const checkAdmin = `SELECT is_admin FROM users WHERE user_id = ?`;
    db.query(checkAdmin, [userId], async (err, result) => {
      if (err) {
        throw new apiError("db error");
      }

      if (result.length === 0) {
        throw new notFoundErr("user not found");
      }

      const user = result[0];

      if (!user.is_admin) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "only admins" });
      }

      const query = "SELECT * FROM parking_zones";
      db.query(query, (err, results) => {
        if (err) {
          throw err;
        }

        res.status(StatusCodes.OK).json(results);
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
    const userId = req.user.user_id;

    const checkAdmin = `SELECT is_admin FROM users WHERE user_id = ?`;
    db.query(checkAdmin, [userId], async (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length === 0) {
        throw new notFoundErr("user not found");
      }

      const user = result[0];

      if (!user.is_admin) {
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
          throw new notFoundErr("Parking zone not found");
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
    const userId = req.user.user_id; // Assuming you have user information in the request

    // Query the database to check if the user is an admin
    const checkAdminQuery = `SELECT is_admin FROM users WHERE user_id = ?`;
    db.query(checkAdminQuery, [userId], async (err, result) => {
      if (err) {
        throw new apiError("Database error");
      }

      if (result.length === 0) {
        throw new notFoundErr("User not found");
      }

      const user = result[0];

      if (!user.is_admin) {
        throw new unAuthorizedErr("only admins");
      }

      const { name, address, hourly_cost } = req.body;
      const query =
        "INSERT INTO parking_zones (name, address, hourly_cost, user_id) VALUES (?, ?, ?, ?)";
      db.query(query, [name, address, hourly_cost, userId], (err, result) => {
        if (err) {
          throw new apiError("failed");
        }

        res
          .status(StatusCodes.CREATED)
          .json({ message: "parking zone created" });
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
        .json({ message: "creation failed" });
    }
  }
};
const updateParkingZone = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedParkingZone = req.body;


    const checkParkingZone = 'SELECT * FROM parking_zones WHERE id = ?';
    db.query(checkParkingZone, [id], async (err, results) => {
      if (err) {
        throw err
      }

      if (results.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'zone not found' });
      }

      const updateZone = 'UPDATE parking_zones SET ? WHERE id = ?';
      db.query(updateZone, [updatedParkingZone, id], (err) => {
        if (err) {
          throw err
        }

        res.status(StatusCodes.OK).json({ message: 'zone updated' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'failed' });
  }
};
const deleteParkingZone = async (req, res) => {};

module.exports = {
  getParkingZone,
  getAllParkingZones,
  createParkingZone,
  updateParkingZone,
  deleteParkingZone,
};
