"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Rules", "spec_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Specializations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Rules", "spec_id");
  },
};
