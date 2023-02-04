"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Grade.belongsTo(models.Course, {
        foreignKey: "course_id",
      });
      Grade.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Grade.init(
    {
      user_id: DataTypes.INTEGER,
      numbered_grade: DataTypes.FLOAT,
      lettered_grade: DataTypes.STRING,
      credit_grade: DataTypes.FLOAT,
      course_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Grade",
    }
  );
  return Grade;
};
