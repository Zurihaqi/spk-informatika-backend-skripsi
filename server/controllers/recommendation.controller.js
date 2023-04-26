const { Recommendation } = require("../db/models/");
const error = require("../misc/errorHandlers");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Recommendation.findAll();

      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      const result = await Recommendation.findAll({
        where: { user_id: req.user.id },
      });

      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const result = await Recommendation.destroy({
        where: { user_id: req.user.id },
      });
      if (result) {
        return res.status(201).json({
          status: "Success",
          message: "Berhasil menghapus data rekomendasi.",
        });
      }
      throw error.DATA_NOT_FOUND;
    } catch (err) {
      next(err);
    }
  },
};
