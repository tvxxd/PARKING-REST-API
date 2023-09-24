const express = require("express");
const router = express.Router();
const {
  addCar,
  updateCar,
  deleteCar,
  getCar,
  getCars,
} = require("../controllers/cars");

router.route("/cars").post(addCar).get(getCars);
router.route("/cars/:id").get(getCar).delete(deleteCar).patch(updateCar);
module.exports = router;
