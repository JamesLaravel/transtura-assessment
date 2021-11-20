const Riders = require("../models").Riders;
exports.getAllRiders = async (req, res, next) => {
  try {
    console.log("here");
    Riders.findAll({}).then((riders) => {
      return res.status(200).json(riders);
    });
  } catch (error) {
    console.log(error);
  }
};
