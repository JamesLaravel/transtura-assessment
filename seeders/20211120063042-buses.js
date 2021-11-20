"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return await queryInterface.bulkInsert("Buses", [
      {
        serial_no: "003",
        seats: 5,
        driver_id: 3,
        plate_no: "AAA-200-BA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serial_no: "004",
        seats: 5,
        driver_id: 1,
        plate_no: "CCB_202_CA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        serial_no: "005",
        seats: 10,
        driver_id: 2,
        plate_no: "AGG-200-BA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete("Buses", null, {});
  },
};
