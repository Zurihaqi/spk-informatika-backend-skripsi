"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Rules", "course_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Courses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("Rules", "specialization_id", {
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
    await queryInterface.removeColumn("Rules", "course_id");
    await queryInterface.removeColumn("Rules", "specialization_id");
  },
};
