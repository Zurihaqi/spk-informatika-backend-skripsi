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
    }
  }
  Grade.init(
    {
      numbered_grade: DataTypes.INTEGER,
      lettered_grade: DataTypes.STRING,
      course_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Grade",
    }
  );
  return Grade;
};
