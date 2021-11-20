"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Trips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rider_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Riders",
          key: "id",
          as: "rider_id",
        },
      },
      bus_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Buses",
          key: "id",
          as: "bus_id",
        },
      },
      number_of_seats: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Trips");
  },
};
