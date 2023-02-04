const { Specialization } = require("../models/");
const error = require("../misc/errorHandlers");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Specialization.findAll();
      if (result[0] === undefined) throw error.EMPTY_TABLE;
      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await Specialization.findByPk(id);
      if (!result) throw error.DATA_NOT_FOUND;
      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      if (req.user.role !== "Admin") throw error.UNAUTHORIZED_ROLE;
      const { spec_name } = req.body;
      const duplicate = await Specialization.findOne({
        where: { spec_name: spec_name },
      });
      if (duplicate) throw error.DUPLICATE_DATA;
      const result = await Specialization.create({
        spec_name: spec_name,
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
  update: async (req, res, next) => {
    try {
      if (req.user.role !== "Admin") throw error.UNAUTHORIZED_ROLE;
      const { spec_name } = req.body;
      const { id } = req.params;
      if (Object.keys(req.body).length === 0) throw error.EMPTY_BODY;
      const dataExist = await Specialization.findByPk(id);
      if (!dataExist) throw error.DATA_NOT_FOUND;
      const result = await Specialization.update(
        {
          spec_name: spec_name,
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
          data: result,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      if (req.user.role !== "Admin") throw error.UNAUTHORIZED_ROLE;
      const { id } = req.params;
      const result = await Specialization.destroy({
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
