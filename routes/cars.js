const express = require("express");
const router = express.Router();
const {
  addCar,
  updateCar,
  deleteCar,
  getCar,
  getCars,
  addCarToParkingZone,
} = require("../controllers/cars");
const errorHandlerMw = require("../middleware/errorHandler");
const userMiddleware = require("../middleware/userAuth");
router.use(errorHandlerMw);
router.use(userMiddleware);

router.route("/").post(addCar).get(getCars);
router.route("/:id").get(getCar).delete(deleteCar).patch(updateCar);

router.route("/:parking_id/add-car/:car_id").post(addCarToParkingZone);

module.exports = router;
