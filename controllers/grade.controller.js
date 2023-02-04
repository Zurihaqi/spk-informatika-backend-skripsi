const { Grade, Course } = require("../models");
const error = require("../misc/errorHandlers");
const grading = require("../helpers/letterGrading");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Grade.findAll({
        where: { user_id: req.user.id },
        include: { model: Course },
      });
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
      const result = await Grade.findOne({
        where: { id: id, user_id: req.user.id },
        include: { model: Course },
      });
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
      const course = await Course.findByPk(course_id, {
        where: { user_id: req.user.id },
      });
      const graded = grading(lettered_grade, parseInt(course.credit));
      const courseExist = await Course.findOne({ where: { id: course_id } });
      if (!courseExist) throw error.FK_NOT_FOUND;
      const duplicate = await Grade.findOne({
        where: { course_id: course_id, user_id: req.user.id },
      });
      if (duplicate) throw error.DUPLICATE_DATA;
      const result = await Grade.create({
        user_id: req.user.id,
        numbered_grade: graded.numbered_grade,
        lettered_grade: lettered_grade,
        credit_grade: graded.credit_grade,
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
      const dataExist = await Grade.findByPk(id, {
        where: { user_id: req.user.id },
      });
      if (!dataExist) throw error.DATA_NOT_FOUND;
      if (course_id) {
        course = await Course.findByPk(course_id);
        const courseExist = await Course.findOne({
          where: { id: course_id },
        });
        if (!courseExist) throw error.FK_NOT_FOUND;
        const duplicate = await Grade.findOne({
          where: { course_id: course_id, user_id: req.user.id },
        });
        if (duplicate) throw error.DUPLICATE_DATA;
      }
      course = await Course.findByPk(dataExist.course_id);
      const graded = grading(lettered_grade, parseInt(course.credit));
      if (Object.keys(req.body).length === 0) throw error.EMPTY_BODY;
      const result = await Grade.update(
        {
          numbered_grade: graded.numbered_grade,
          lettered_grade: lettered_grade,
          credit_grade: graded.credit_grade,
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
        where: { id: id, user_id: req.user.id },
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
