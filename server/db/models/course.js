"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.Specialization, {
        foreignKey: "spec_id",
      });
    }
  }
  Course.init(
    {
      course_code: DataTypes.STRING,
      course_name: DataTypes.STRING,
      credit: DataTypes.INTEGER, //SKS
      semester: DataTypes.INTEGER,
      spec_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
