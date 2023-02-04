const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const error = require("../misc/errorHandlers");
const hash = require("../middlewares/passwordHashing");
const { request } = require("express");

module.exports = {
  signIn: async (req, res, next) => {
    try {
      const { email } = req.body;

      //Cek apakah email belum terdaftar
      const userExist = await User.findOne({ where: { email: email } });
      if (!userExist) throw error.INVALID_CRED;

      const passwordField = userExist.password.split("$");
      const salt = passwordField[0];
      const validatePassword = hash(req.body.password, salt);

      if (validatePassword === passwordField[1]) {
        const payload = {
          id: userExist.id,
          role: userExist.role,
          name: userExist.name,
          email: userExist.email,
          profile_pic: userExist.profile_pic,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "1h",
        });
        req.token = token;
        return res.status(201).json({
          status: "Success",
          message: "Login sukses",
          token: token,
        });
      }
      throw error.INVALID_CRED; //Password salah
    } catch (err) {
      next(err);
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const passwordHash = hash(req.body.password);
      req.body.password = passwordHash;

      //Cek apakah email sudah terdaftar
      const userExist = await User.findOne({ where: { email: email } });
      if (userExist) throw error.EMAIL_EXIST;

      const createUserResult = await User.create({
        role: "User",
        name: name,
        email: email,
        password: req.body.password,
      });
      if (createUserResult) {
        const userData = {
          name: createUserResult.name,
          email: createUserResult.email,
        };
        return res.status(201).json({
          status: "Success",
          message: "Register sukses.",
          data: userData,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
