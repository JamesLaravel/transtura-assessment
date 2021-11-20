const Riders = require("../models").Riders;
exports.getAllRiders = async (req, res, next) => {
  try {
    const riders = await Riders.findAll();
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
