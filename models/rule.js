"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rule.belongsTo(models.Course, {
        foreignKey: "course_id",
      });
      Rule.belongsTo(models.Specialization, {
        foreignKey: "specialization_id",
      });
    }
  }
  Rule.init(
    {
      rule_name: DataTypes.STRING,
      course_id: DataTypes.INTEGER,
      specialization_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rule",
    }
  );
  return Rule;
};
