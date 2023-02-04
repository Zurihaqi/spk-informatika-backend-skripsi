const { Course } = require("../models/");
const error = require("../misc/errorHandlers");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Course.findAll();
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
      const result = await Course.findByPk(id);
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
      const { course_code, course_name, credit, semester } = req.body;
      const duplicate = await Course.findOne({
        where: { course_code: course_code },
      });
      if (duplicate) throw error.DUPLICATE_DATA;
      const result = await Course.create({
        course_code: course_code,
        course_name: course_name,
        credit: credit,
        semester: semester,
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
      const { course_code, course_name, credit, semester } = req.body;
      const { id } = req.params;
      if (Object.keys(req.body).length === 0) throw error.EMPTY_BODY;
      const dataExist = await Course.findByPk(id);
      if (!dataExist) throw error.DATA_NOT_FOUND;
      const result = await Course.update(
        {
          course_code: course_code,
          course_name: course_name,
          credit: credit,
          semester: semester,
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
      const result = await Course.destroy({
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