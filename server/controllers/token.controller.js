const { Token } = require("../db/models");
const Op = require("sequelize").Op;
const error = require("../misc/errorHandlers");
const isEmpty = require("../helpers/emptyObjectCheck");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      if (req.user.role !== "ADMIN") throw error.UNAUTHORIZED_ROLE;

      let options = { where: {} };
      const { isValid } = req.query;
      isValid === "true"
        ? (options.where.isValid = true)
        : isValid === "false"
        ? (options.where.isValid = false)
        : options;

      const result = await Token.findAll(options);
      // if (isEmpty(result)) throw error.EMPTY_TABLE;

      return res.status(200).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  clearToken: async (req, res, next) => {
    try {
      if (req.user.role !== "ADMIN") throw error.UNAUTHORIZED_ROLE;

      const result = await Token.destroy({
        where: {
          [Op.or]: [
            {
              isValid: false,
            },
            { createdAt: { [Op.lte]: new Date(Date.now() - 60 * 60 * 1000) } },
          ],
        },
      });
      if (result) {
        return res.status(200).json({
          status: "Success",
          message: "Tabel Token berhasil dibersihkan",
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
