const models = require("../models");
const { Op } = require("sequelize");
const { validateInputData, getSignedToken } = require("../helper");

exports.getAllRiders = async (req, res, next) => {
  try {
    const riders = await models.Riders.findAll();
    return res.status(200).json({
      error: false,
      message: "riders retrieved",
      data: riders,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).jsons({
      error: true,
      message: "Internal Server Error",
      statusCode: 500,
    });
  }
};

exports.RiderLogin = async (req, res, next) => {
  try {
    const validate = validateInputData(req);
    if (validate) {
      return res.status(400).json({
        error: true,
        message: "Validation Error",
        data: validate,
      });
    }

    const rider = await models.Riders.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ["id", "email", "name"],
    });

    if (!rider) {
      return res.status(400).json({
        error: true,
        message: "Incorrect email or password",
        data: null,
      });
    }

    const token = getSignedToken(rider);

    return res.status(200).json({
      error: false,
      message: "Rider successfully login",
      data: {
        user: {
          name: rider.name,
          email: rider.email,
        },
        token,
      },
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

exports.getAvailableBuses = async (req, res, next) => {
  try {
    const buses = await models.Buses.findAll({
      where: {
        seats: {
          [Op.gt]: 0,
        },
      },
    });
    return res.status(200).json({
      error: false,
      message: "Available buses",
      data: buses,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

exports.bookTrip = async (req, res, next) => {
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
    const obj = req.body;
    const trip = await models.Trip.findOne({
      where: {
        rider_id: Number(user.id),
        status: {
          [Op.or]: ["pending", "active"],
        },
      },
    });

    if (obj.number_of_trip <= 0) {
      return res.status(400).json({
        error: true,
        message: "Please pass a valid integer",
      });
    }
    if (trip) {
      return res.status(400).json({
        error: true,
        message: `User still have ${trip.status} trip`,
      });
    }

    const bus = await models.Buses.findOne({
      where: {
        [Op.or]: [{ serial_no: obj.bus }, { plate_no: obj.bus }],
      },
      attributes: ["id", "serial_no", "plate_no", "seats", "driver_id"],
      include: [
        {
          model: models.Drivers,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!bus) {
      return res.status(400).json({
        error: true,
        message: "Bus not found",
      });
    }

    if (bus.seats <= 0) {
      return res.status(400).json({
        error: true,
        message: "Bus is out of seat, Please select another bus",
      });
    }

    if (bus.seats < obj.number_of_seats) {
      return res.status(400).json({
        error: true,
        message: "Not enough seat for user",
      });
    }

    const no_seat = obj.number_of_seats;
    const book = await models.Trip.create({
      rider_id: user.id,
      bus_id: bus.id,
      number_of_seats: no_seat,
      driver_id: bus.Driver.id,
      status: "pending",
    });

    return res.status(200).json({
      error: false,
      message: "Trip booked successfully",
      data: {
        trip_id: book.id,
        bus_serial_no: bus.serial_no,
        bus_plate_no: bus.plate_no,
        driver_name: bus.Driver.name,
        status: book.status,
      },
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

exports.trip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { user } = req;
    const trip = await models.Trip.findOne({
      where: {
        id: tripId,
        rider_id: user.id,
      },
      include: [
        {
          model: models.Buses,
          attributes: ["serial_no", "plate_no"],
          include: [
            {
              model: models.Drivers,
              attributes: ["name", "email"],
            },
          ],
        },
      ],
    });

    // console.log("trips", trip.getBuses());

    if (!trip) {
      return res.status(400).json({
        error: true,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Trip retrieved",
      data: trip,
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
        rider_id: user.id,
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
