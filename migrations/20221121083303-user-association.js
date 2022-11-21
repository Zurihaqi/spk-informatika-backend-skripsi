"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "recommendation_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Recommendations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("Users", "grade_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Grades",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "recommendation_id");
    await queryInterface.removeColumn("Users", "grade_id");
  },
};
