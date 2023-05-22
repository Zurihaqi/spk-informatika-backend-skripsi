const { Audit, User } = require("../db/models/");
const error = require("../misc/errorHandlers");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Audit.findAll({
        include: { model: User, attributes: ["name"] },
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
  deleteOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Audit.destroy({ where: { id: id } });

      if (!result) {
        throw error.DATA_NOT_FOUND;
      }

      return res.status(201).json({
        status: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      await Audit.destroy({ where: {} });

      return res.status(201).json({
        status: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
};
