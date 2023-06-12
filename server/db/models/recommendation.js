"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recommendation.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Recommendation.init(
    {
      crispOutput: DataTypes.ARRAY(DataTypes.FLOAT),
      percentage: DataTypes.ARRAY(DataTypes.FLOAT),
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Recommendation",
    }
  );
  return Recommendation;
};
