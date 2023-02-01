const { Grade, Course } = require("../models");
const error = require("../misc/errorHandlers");
const grading = require("../helpers/letterGrading");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Grade.findAll({ include: { model: Course } });
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
      const result = await Grade.findByPk(id, { include: { model: Course } });
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
      const { lettered_grade, course_id } = req.body;
      const course = await Course.findByPk(course_id);
      const numbered_grade = grading(lettered_grade, parseInt(course.credit));
      const courseExist = await Course.findOne({ where: { id: course_id } });
      if (!courseExist) throw error.FK_NOT_FOUND;
      const duplicate = await Grade.findOne({
        where: { course_id: course_id },
      });
      if (duplicate) throw error.DUPLICATE_DATA;
      const result = await Grade.create({
        numbered_grade: numbered_grade,
        lettered_grade: lettered_grade,
        course_id: course_id,
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
      const { lettered_grade, course_id } = req.body;
      const { id } = req.params;
      let course;
      const dataExist = await Grade.findByPk(id);
      if (!dataExist) throw error.DATA_NOT_FOUND;
      if (!course_id) course = await Course.findByPk(dataExist.course_id);
      if (course_id) {
        course = await Course.findByPk(course_id);
        const courseExist = await Course.findOne({
          where: { id: course_id },
        });
        if (!courseExist) throw error.FK_NOT_FOUND;
      }
      const numbered_grade = grading(lettered_grade, parseInt(course.credit));
      if (Object.keys(req.body).length === 0) throw error.EMPTY_BODY;
      const result = await Grade.update(
        {
          numbered_grade: numbered_grade,
          lettered_grade: lettered_grade,
          course_id: course_id,
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
      const { id } = req.params;
      const result = await Grade.destroy({
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
