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
      "Riders",
      [
        {
          email: "kola@email.com",
          name: "Kolade Ayobami",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "shola@email.com",
          name: "Shola Omotayo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "mikie@email.com",
          name: "Mike Somtochukw",
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
    return await queryInterface.bulkDelete("Riders", null, {});
  },
};
