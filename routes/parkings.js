const express = require("express");
const router = express.Router();
const {
  getAllParkingZones,
  getParkingZone,
  createParkingZone,
  updateParkingZone,
  deleteParkingZone,
  getAllParkingHistory
} = require("../controllers/parkings");

const adminMiddleware = require("../middleware/adminAuth");
const errorHandlerMw = require("../middleware/errorHandler");
router.use(errorHandlerMw);

router.use(adminMiddleware);

router.route("/parking-zones").post(createParkingZone).get(getAllParkingZones);
router
  .route("/parking-zones/:id")
  .get(getParkingZone)
  .delete(deleteParkingZone)
  .patch(updateParkingZone);
router.route("/parking-car-history").get(getAllParkingHistory);
module.exports = router;
