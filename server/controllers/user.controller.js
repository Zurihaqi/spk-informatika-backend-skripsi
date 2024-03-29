const { User, Grade, Recommendation, Notification } = require("../db/models/");
const Op = require("sequelize").Op;
const { WEBHOOK_URL } = process.env;
const fetch = require("node-fetch");
const error = require("../misc/errorHandlers");
const updater = require("../helpers/updater");
const isEmpty = require("../helpers/emptyObjectCheck");
const hash = require("../middlewares/passwordHashing");

module.exports = {
  getAllUser: async (req, res, next) => {
    try {
      const { name, isVerified } = req.query;
      let options = {};

      if (name) {
        options.where = { name: { [Op.iLike]: name } };
      }

      if (isVerified) {
        options.where = { isVerified: isVerified };
      }

      const result = await User.scope("noPassword").findAll(options);

      if (result) {
        return res.status(201).json({
          status: "Success",
          result: result,
        });
      }
      throw error.USER_NOT_FOUND;
    } catch (err) {
      next(err);
    }
  },
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

      if (email) {
        const emailExist = await User.findOne({ where: { email: email } });
        if (emailExist) throw error.EMAIL_EXIST;
      }

      if (student_id) {
        const idExist = await User.findOne({
          where: { student_id: student_id },
        });
        if (idExist) throw error.STUD_ID_EXIST;
      }

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
        delete result[1].dataValues.password;
        delete result[1].dataValues.role;
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
      const { id } = req.user;

      const userExist = await User.findByPk(id);

      const passwordField = userExist.password.split("$");
      const salt = passwordField[0];
      const validatePassword = hash(req.body.password, salt);

      if (validatePassword === passwordField[1]) {
        await Recommendation.destroy({ where: { user_id: id } });
        await Grade.destroy({
          where: { user_id: id },
        });
        await Notification.destroy({ where: { user_id: id } });
        const result = await User.destroy({
          where: { id: id },
        });
        if (result) {
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
      const { id } = req.user;

      const userExist = await User.findByPk(id);

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
        if (result[0]) {
          await Notification.create({
            content: "Kata Sandi anda telah diubah.",
            user_id: id,
          });

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

      const webhookBody = {
        embeds: [
          {
            title: "Kendala Dilaporkan",
            fields: [
              { name: "Pengirim:", value: req.user.name },
              { name: "Email:", value: req.user.email },
              { name: "Judul:", value: title },
              { name: "Pesan:", value: message },
            ],
          },
        ],
      };

      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookBody),
      });

      if (result) {
        return res.status(201).json({
          status: "Success",
          message: "Pesan terkirim",
        });
      }
      throw error.WEBHOOK_FAIL;
    } catch (err) {
      next(err);
    }
  },
  addAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await User.update(
        { role: "Pengelola" },
        { where: { id: id } }
      );
      if (result[0]) {
        await Notification.create({
          content: "Anda telah dijadikan pengelola.",
          user_id: id,
        });

        return res.status(201).json({
          status: "Success",
          message: "Berhasil menambahkan pengelola.",
        });
      }
      throw error.USER_NOT_FOUND;
    } catch (err) {
      next(err);
    }
  },
  removeAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await User.update(
        { role: "Mahasiswa" },
        { where: { id: id } }
      );
      if (result[0]) {
        await Notification.create({
          content: "Anda bukan lagi pengelola.",
          user_id: id,
        });

        return res.status(201).json({
          status: "Success",
          message: "Berhasil menghapus pengelola.",
        });
      }
      throw error.USER_NOT_FOUND;
    } catch (err) {
      next(err);
    }
  },
  approveAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { declined } = req.query;

      if (declined) {
        const result = await User.update(
          {
            isVerified: true,
            role: "Mahasiswa",
          },
          { where: { id: id } }
        );
        if (result[0]) {
          await Notification.create({
            content: "Pengajuan pengelola anda ditolak.",
            user_id: id,
          });

          return res.status(201).json({
            status: "Success",
            message: "Berhasil menolak pengelola",
          });
        }
      }

      const result = await User.update(
        { isVerified: true },
        { where: { id: id } }
      );
      if (result[0]) {
        await Notification.create({
          content: "Pengajuan pengelola anda disetujui.",
          user_id: id,
        });

        return res.status(201).json({
          status: "Success",
          message: "Berhasil menyetujui pengelola",
        });
      }
      throw error.USER_NOT_FOUND;
    } catch (err) {
      next(err);
    }
  },
};
