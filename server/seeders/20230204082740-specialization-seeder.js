"use strict";

const peminatan = require("../data/peminatan.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    const dataPeminatan = peminatan.map((e) => {
      return {
        spec_name: e.spec_name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Specializations", dataPeminatan);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Specializations", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
