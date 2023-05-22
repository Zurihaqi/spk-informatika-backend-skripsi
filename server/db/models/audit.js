"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Audit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Audit.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Audit.init(
    {
      action: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Audit",
    }
  );
  return Audit;
};
