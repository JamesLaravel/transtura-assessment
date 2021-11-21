"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trip.belongsTo(models.Buses, {
        foreignKey: "bus_id",
      });

      Trip.belongsTo(models.Riders, {
        foreignKey: "rider_id",
      });
    }
  }
  Trip.init(
    {
      rider_id: DataTypes.INTEGER,
      bus_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      number_of_seats: DataTypes.INTEGER,
      driver_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Trip",
    }
  );
  return Trip;
};
