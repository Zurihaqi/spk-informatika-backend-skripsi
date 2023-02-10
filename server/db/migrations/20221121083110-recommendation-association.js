"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Recommendations", "rule_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Rules",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("Recommendations", "specialization_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Specializations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("Recommendations", "user_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Recommendations", "rule_id");
    await queryInterface.removeColumn("Recommendations", "specialization_id");
    await queryInterface.removeColumn("Recommendations", "user_id");
  },
};
