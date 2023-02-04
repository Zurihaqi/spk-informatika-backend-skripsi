const { User } = require("../models/");
const error = require("../misc/errorHandlers");
const hash = require("../middlewares/passwordHashing");

module.exports = {
  get: async (req, res, next) => {
    try {
      const { id } = req.user;
      const dataExist = await User.findByPk(id);
      if (!dataExist) throw error.DATA_NOT_FOUND;
      const result = await User.findByPk(id, {
        attributes: ["name", "email", "profile_pic", "student_id", "role"],
      });
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
      if (Object.keys(req.body).length === 0) throw error.EMPTY_BODY;
      if (req.body.password) {
        const passwordHash = hash(req.body.password);
        req.body.password = passwordHash;
      }
      const dataExist = await User.findByPk(id);
      if (!dataExist) throw error.DATA_NOT_FOUND;
      const result = await User.update(
        {
          name: name,
          email: email,
          password: req.body.password,
          profile_pic: profile_pic,
          student_id: student_id,
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
      const { id } = req.user;
      const result = await User.destroy({
        where: { id: id },
      });
      if (!result) throw error.DATA_NOT_FOUND;
      return res.status(201).json({
        status: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
};
