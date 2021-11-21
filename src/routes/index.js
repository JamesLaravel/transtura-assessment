const router = require("express").Router();
const { body, param } = require("express-validator");
const ridersControllers = require("../controllers/riders.controller");
const driverControllers = require("../controllers/driver.controller");
const { Auth } = require("../middleware/auth.mw");
const { DriverAuth } = require("../middleware/driver.mw");

router.get("/riders", ridersControllers.getAllRiders);
router.post(
  "/rider/login",
  [
    body("email")
      .notEmpty()
      .withMessage("email, email is required")
      .isEmail()
      .withMessage("email, enter a valid email"),
  ],
  ridersControllers.RiderLogin
);
router.get(
  "/riders/available/buses",
  Auth,
  ridersControllers.getAvailableBuses
);

router.post(
  "/riders/book/trip",
  [
    body("number_of_seats")
      .notEmpty()
      .withMessage("number_of_seats, number of seats is required")
      .isInt()
      .withMessage("number_of_seats, number of seats should be integer"),
    body("bus")
      .notEmpty()
      .withMessage("bus, bus is required")
      .isString()
      .withMessage("bus, bus should be string"),
  ],
  Auth,
  ridersControllers.bookTrip
);

router.get(
  "/riders/trip/:tripId",
  [
    param("tripId")
      .notEmpty()
      .withMessage("tripId, trip id is required")
      .isInt()
      .withMessage("tripId, trip id must be integer"),
  ],
  Auth,
  ridersControllers.trip
);

router.get(
  "/riders/trip/status/:tripId",
  [
    param("tripId")
      .notEmpty()
      .withMessage("tripId, trip id is required")
      .isInt()
      .withMessage("tripId, trip id must be integer"),
  ],
  Auth,
  ridersControllers.tripStatus
);

router.post(
  "/driver/login",
  [
    body("email")
      .notEmpty()
      .withMessage("email, email is required")
      .isEmail()
      .withMessage("email, enter a valid email"),
  ],
  driverControllers.driveLogin
);

router.get("/driver/trip/request", DriverAuth, driverControllers.tripRequest);
router.post(
  "/driver/trip/handle/request",
  [
    body("tripId")
      .notEmpty()
      .withMessage("tripId, trip id is required")
      .isInt()
      .withMessage("tripId, trip id is integer"),
    body("status")
      .notEmpty()
      .withMessage("status, status is required")
      .isIn(["accept", "active", "completed"])
      .withMessage(
        "status, status expect to be either accept, active, completed"
      ),
  ],
  DriverAuth,
  driverControllers.HandleRequest
);

router.get(
  "/driver/trip/status/:tripId",
  [
    param("tripId")
      .notEmpty()
      .withMessage("tripId, trip id is required")
      .isInt()
      .withMessage("tripId, trip id must be integer"),
  ],
  DriverAuth,
  driverControllers.tripStatus
);

module.exports = router;
