"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "role");
  },
};
