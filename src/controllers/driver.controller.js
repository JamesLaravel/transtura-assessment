const models = require("../models");
const { validateInputData, getSignedToken } = require("../helper");

exports.driveLogin = async (req, res, next) => {
  try {
    const validate = validateInputData(req);
    if (validate) {
      return res.status(400).json({
        error: true,
        message: "Validation Error",
        data: validate,
      });
    }

    const driver = await models.Drivers.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ["id", "email", "name"],
    });

    if (!driver) {
      return res.status(400).json({
        error: true,
        message: "Incorrect email or password",
        data: null,
      });
    }

    const token = getSignedToken(driver);

    return res.status(200).json({
      error: false,
      message: "Driver successfully login",
      data: {
        user: {
          name: driver.name,
          email: driver.email,
        },
        token,
      },
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

exports.tripRequest = async (req, res, next) => {
  try {
    const { user } = req;

    const trip = await models.Trip.findOne({
      where: {
        driver_id: user.id,
        status: "pending",
      },
      attributes: ["number_of_seats", "status"],
      include: [
        {
          model: models.Riders,
          attributes: ["name", "email"],
        },
        {
          model: models.Buses,
          attributes: ["serial_no", "plate_no"],
        },
      ],
    });

    return res.status(200).json({
      error: false,
      message: "Driver Trip Request",
      data: trip,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

exports.HandleRequest = async (req, res, next) => {
  try {
    const validate = validateInputData(req);
    if (validate) {
      return res.status(400).json({
        error: true,
        message: "Validation Error",
        data: validate,
      });
    }

    const { user } = req;
    const { tripId, status } = req.body;

    let resMsg;

    if (status === "accept") {
      resMsg = "accepted";
    } else if (status === "active") {
      resMsg = "started";
    } else if (status === "completed") {
      resMsg = "completed";
    } else if (status === "reject") {
      resMsg = "rejected";
    } else {
      return res.status(400).json({
        message: "Pass a valid handler",
      });
    }

    const trip = await models.Trip.findOne({
      where: {
        id: tripId,
        driver_id: user.id,
      },
      include: [
        {
          model: models.Buses,
          attributes: ["id", "seats", "serial_no", "plate_no"],
        },
        {
          model: models.Drivers,
          attributes: ["name", "email"],
        },
        {
          model: models.Riders,
          attributes: ["name", "email"],
        },
      ],
      //attributes: ["id", ""]
    });

    let bus = trip.Bus;

    if (!trip) {
      return res.status(400).json({
        error: true,
        message: "Trip not found",
      });
    }

    if (trip.status === status) {
      return res.status(400).json({
        error: true,
        message: `Trip already ${resMsg}`,
      });
    }

    if (status === "accept") {
      const newseatSize = trip.Bus.seats - trip.number_of_seats;
      await models.Buses.update(
        {
          seats: newseatSize,
        },
        {
          where: { id: trip.Bus.id },

          returning: true,
          plan: true,
        }
      );
      bus.seats = newseatSize;
    }

    const update = await models.Trip.update(
      {
        status,
      },
      { where: { id: trip.id }, returning: true, plan: true }
    );

    return res.status(200).json({
      error: false,
      message: `Trip ${resMsg} successfully`,
      data: {
        tripId: update.id,
        number_of_seats: update.number_of_seats,
        bus: {
          serial_no: bus.serial_no,
          plate_no: bus.plate_no,
          seats: bus.seats,
        },
        driver: {
          name: trip.Driver.name,
          email: trip.Driver.email,
        },
        rider: {
          name: trip.Rider.name,
          email: trip.Rider.email,
        },
      },
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

exports.tripStatus = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { user } = req;

    const trip = await models.Trip.findOne({
      where: {
        id: tripId,
        driver_id: user.id,
      },
    });

    if (!trip) {
      return res.status(400).json({
        error: true,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "trip status",
      data: {
        status: trip.status,
      },
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};
