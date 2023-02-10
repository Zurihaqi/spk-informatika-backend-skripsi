"use strict";
const { Model } = require("sequelize");
const hash = require("../../middlewares/passwordHashing");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profile_pic: DataTypes.STRING,
      student_id: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (user, options) => {
          user.password = hash(user.password);
          return user;
        },
      },
    }
  );
  return User;
};
