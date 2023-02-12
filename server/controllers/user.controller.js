const { User, Token } = require("../db/models/");
const error = require("../misc/errorHandlers");
const updater = require("../helpers/updater");
const isEmpty = require("../helpers/emptyObjectCheck");

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

      const incomingUpdate = updater(
        { name, email, profile_pic, student_id },
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
        result[1].password = undefined;
        delete result[1].password;
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
    } catch (err) {
      next(err);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      const { id, token } = req.user;

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
        return res.status(200).json({
          status: "Success",
          message: "Berhasil merubah password lakukan login ulang",
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
