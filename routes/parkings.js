const express = require("express");
const router = express.Router();
const {
  getAllParkingZones,
  getParkingZone,
  createParkingZone,
  updateParkingZone,
  deleteParkingZone,
} = require("../controllers/parkings");

router.route("/").post(createParkingZone).get(getAllParkingZones);
router
  .route("/:id")
  .get(getParkingZone)
  .delete(deleteParkingZone)
  .patch(updateParkingZone);

module.exports = router;
