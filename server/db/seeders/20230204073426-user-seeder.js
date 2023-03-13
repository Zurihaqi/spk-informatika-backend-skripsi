"use strict";
require("dotenv").config();
const { EMAIL, PASSWORD } = process.env;
const hash = require("../../middlewares/passwordHashing");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = hash(PASSWORD);
    const adminData = [
      {
        role: "Admin",
        name: "Zul",
        email: EMAIL,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Users", adminData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
