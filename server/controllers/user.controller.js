const { User, Token, Grade } = require("../db/models/");
const { WEBHOOK_URL } = process.env;
const error = require("../misc/errorHandlers");
const updater = require("../helpers/updater");
const isEmpty = require("../helpers/emptyObjectCheck");
const hash = require("../middlewares/passwordHashing");
const webhook = require("webhook-discord");

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
      const Hook = new webhook.Webhook(WEBHOOK_URL);
      const msg = new webhook.MessageBuilder()
        .setDescription(`${message}`)
        .setTitle(`${title}`)
        .setName("Kang Kritik")
        .setColor("#c73230")
        .setName(`${req.user.name}`)
        .setThumbnail(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Warning.svg/1200px-Warning.svg.png"
        )
        .setAuthor(`${req.user.email}`);

      if (!req.user.profile_pic) {
        msg.setAvatar(
          "https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg="
        );
      } else {
        msg.setAvatar(`${req.user.profile_pic}`);
      }

      const result = Hook.send(msg);
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
