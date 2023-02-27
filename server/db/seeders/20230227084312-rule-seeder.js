"use strict";

const rules = require("../data/rules.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    const rulesData = rules.map((e) => {
      return {
        condition: e.condition,
        conclusion: e.conclusion,
        connection: e.connection,
        spec_id: e.spec_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Rules", rulesData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Rules", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
