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
      //attributes: ["id", ""]
    });

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

   
    await models.Trip.update(
      {
        status,
      },
      { where: { id: trip.id } }
    );

    return res.status(200).json({
      error: false,
      message: `Trip ${resMsg} successfully`,
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

// const AcceptOrRejectTrip = async (trip, request) => {
//   const bus = await models.Buses.findOne({
//     where: { id: trip.bus_id },
//     attributes: ["id", "serial_no", "seats"],
//   });

//   console.log("bus", bus);
//   console.log("req", request);
//   console.log("trip", trip);
//   let res;
//   // all possible cases
//   if (request === "accept" && trip.status === "pending") {
//     // is handles the use case where the trip is accepted

//     const newseatsize = bus.seats - trip.number_of_seats;

//     await models.Buses.update({ id: bus.id }, { seats: newseatsize });

//     await models.Trip.update({ id: trip.id }, { status: "accept" });
//     res.status = true;
//     res.msg = "Trip accepted successfully";
//   }

//   if (request === "reject" && trip.status === "pending") {
//     await models.Trip.update({ id: trip.id }, { status: "reject" });
//     res.status = true;
//     res.msg = "Trip Rejected successfully";
//   }

//   if (request === "completed" && trip.status === "pending") {
//     res.status = true;
//     res.msg = "Trip still pending";
//   }

//   if (request === "complete" && trip.status === "accept") {
//     // is handles the use case where the trip is completed

//     const newseatsize = bus.seats + trip.number_of_seats;

//     await models.Buses.update({ id: bus.id }, { seats: newseatsize });

//     await models.Trip.update({ id: trip.id }, { status: "completed" });
//     res.status = true;
//     res.msg = "Trip completed successfully";
//   }

//   if (request === "reject" && trip.status === "accept") {
//     const newseatsize = bus.seats + trip.number_of_seats;

//     await models.Buses.update({ id: bus.id }, { seats: newseatsize });

//     await models.Trip.update({ id: trip.id }, { status: "reject" });

//     res.status = true;
//     res.msg = "Trip Rejected successfully";
//   }

//   if(request === "reject" && trip.status === " ")
//   console.log(res);
//   return res;
// };
