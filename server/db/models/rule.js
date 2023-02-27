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
      Rule.belongsTo(models.Specialization, {
        foreignKey: "spec_id",
      });
    }
  }
  Rule.init(
    {
      condition: DataTypes.ARRAY(DataTypes.STRING),
      conclusion: DataTypes.ARRAY(DataTypes.STRING),
      connection: DataTypes.ENUM("and", "or"),
      spec_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rule",
    }
  );
  return Rule;
};
