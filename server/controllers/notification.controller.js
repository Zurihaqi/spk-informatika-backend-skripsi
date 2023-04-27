const { Notification, User } = require("../db/models/");
const error = require("../misc/errorHandlers");

module.exports = {
  get: async (req, res, next) => {
    try {
      const { id } = req.user;

      const result = await Notification.findAll({
        where: { user_id: id },
      });

      if (result) {
        return res.status(201).json({
          status: "Success",
          data: result,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const { content, id } = req.body;

      const userExist = await User.findByPk(id);
      if (!userExist) throw error.USER_NOT_FOUND;

      const result = await Notification.create({
        content: content,
        user_id: id,
      });

      if (result) {
        return res.status(201).json({
          status: "Success",
          message: "Berhasil menambahkan notifikasi",
        });
      }
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.user;

      const result = await Notification.destroy({ where: { user_id: id } });

      if (result) {
        return res.status(201).json({
          status: "Success",
          message: "Berhasil membersihkan notifikasi",
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
