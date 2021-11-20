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

    return await queryInterface.bulkInsert(
      "Drivers",
      [
        {
          name: "Ewerem Chizurum",
          email: "chiboy@email.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Samson Effiong",
          email: "strongman@email.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Blessing James",
          email: "blessed@email.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete("Drivers", null, {});
  },
};
