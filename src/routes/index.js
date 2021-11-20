const router = require("express").Router();
const { body, param } = require("express-validator");
const ridersControllers = require("../controllers/riders.controller");
const { riderAuth } = require("../middleware/rider.mw");
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
  riderAuth,
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
  riderAuth,
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
  riderAuth,
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
    riderAuth,
    ridersControllers.tripStatus
  );

module.exports = router;
