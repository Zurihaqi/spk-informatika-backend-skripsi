const { User, Token, Grade } = require("../db/models/");
const { WEBHOOK_URL } = process.env;
const fetch = require("node-fetch");
const error = require("../misc/errorHandlers");
const updater = require("../helpers/updater");
const isEmpty = require("../helpers/emptyObjectCheck");
const hash = require("../middlewares/passwordHashing");

module.exports = {
  get: async (req, res, next) => {
    try {
      const { id } = req.user;

      const result = await User.scope("noPassword").findByPk(id, {});
      if (!result) throw error.DATA_NOT_FOUND;

      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { name, email, profile_pic, student_id } = req.body;
      const { id } = req.user;

      let normalizedName;

      if (name) {
        normalizedName = name
          .replace(/\s+/g, " ")
          .replace(
            /(^\w|\s\w)(\S*)/g,
            (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
          );
      }

      const incomingUpdate = updater(
        { name: normalizedName, email, profile_pic, student_id },
        {}
      );

      if (isEmpty(incomingUpdate)) throw error.EMPTY_BODY;

      const result = await User.update(
        {
          ...incomingUpdate,
        },
        {
          where: { id: id },
          returning: true,
          plain: true,
        }
      );
      if (result) {
        return res.status(201).json({
          status: "Success",
          data: result[1],
        });
      }
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id, token } = req.user;

      const userExist = await User.findByPk(req.user.id);

      const passwordField = userExist.password.split("$");
      const salt = passwordField[0];
      const validatePassword = hash(req.body.password, salt);

      if (validatePassword === passwordField[1]) {
        await Grade.destroy({
          where: { user_id: req.user.id },
        });
        const result = await User.destroy({
          where: { id: id },
        });
        if (result) {
          await Token.update({ isValid: false }, { where: { token: token } });
          return res.status(201).json({
            status: "Success",
            message: "Berhasil menghapus akun",
          });
        }
      }
      throw error.WRONG_PASSWORD;
    } catch (err) {
      next(err);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      const { id, token } = req.user;

      const userExist = await User.findByPk(req.user.id);

      const passwordField = userExist.password.split("$");
      const salt = passwordField[0];
      const validatePassword = hash(req.body.oldPassword, salt);

      if (validatePassword === passwordField[1]) {
        const result = await User.update(
          {
            password: req.body.password,
          },
          {
            where: { id: id },
            individualHooks: true,
          }
        );
        if (result) {
          await Token.update({ isValid: false }, { where: { token: token } });
          return res.status(201).json({
            status: "Success",
            message: "Berhasil merubah password lakukan login ulang",
          });
        }
      }
      throw error.WRONG_PASSWORD;
    } catch (err) {
      next(err);
    }
  },
  sendMessage: async (req, res, next) => {
    try {
      const { title, message } = req.body;
      const url = WEBHOOK_URL;

      const result = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: {
            title: `${title}`,
            description: `${message}`,
            thumbnail:
              "https://images-ext-2.discordapp.net/external/MJYCQ9ca5vHr6KGEljX70Ehg8Gt3H-NxWtTiqq0y100/https/upload.wikimedia.org/wikipedia/commons/thumb/1/17/Warning.svg/1200px-Warning.svg.png?width=539&height=498",
            author: {
              name: `${req.user.name}`,
              icon_url: `${req.user.profile.pic}`,
            },
          },
        }),
      });

      if (result) {
        return res.status(201).json({
          status: "Success",
          message: "Pesan terkirim",
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
