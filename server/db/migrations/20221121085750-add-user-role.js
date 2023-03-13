"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.ENUM("Mahasiswa", "Pengelola", "Admin"),
      defaultValue: "Mahasiswa",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface
      .removeColumn("Users", "role")
      .then(
        queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";')
      );
  },
};
