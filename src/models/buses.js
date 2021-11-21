"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Buses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Buses.belongsTo(models.Drivers, {
        foreignKey: "driver_id",
        onDelete: "CASCADE",
      });

      Buses.hasOne(models.Trip, {
        foreignKey: "bus_id",
      });
    }
  }
  Buses.init(
    {
      serial_no: DataTypes.STRING,
      seats: DataTypes.INTEGER,
      driver_id: DataTypes.INTEGER,
      plate_no: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Buses",
    }
  );
  return Buses;
};
