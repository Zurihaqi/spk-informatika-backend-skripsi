const { Grade, Course } = require("../db/models/");
const error = require("../misc/errorHandlers");
const grading = require("../helpers/letterGrading");
const updater = require("../helpers/updater");
const isEmpty = require("../helpers/emptyObjectCheck");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Grade.findAll({
        include: { model: Course },
      });

      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  //Mengambil nilai mahasiswa
  get: async (req, res, next) => {
    try {
      const result = await Grade.findAll({
        where: { user_id: req.user.id },
        include: { model: Course },
      });
      // if (isEmpty(result)) throw error.EMPTY_TABLE;

      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  //Mengambil nilai sesuai ID
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

  //Membuat nilai baru
  create: async (req, res, next) => {
    try {
      const { lettered_grade, course_id } = req.body;

      const course = await Course.findByPk(course_id);
      if (!course) throw error.FK_NOT_FOUND;

      const graded = grading(lettered_grade, +course.credit);

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

  //Update data nilai mahasiswa
  update: async (req, res, next) => {
    try {
      const { lettered_grade, course_id } = req.body;
      const { id } = req.params;

      const findGrade = await Grade.findAll({
        where: { user_id: req.user.id },
        raw: true,
      });

      const gradeExist = findGrade.find((e) => +e.id === +id);
      if (isEmpty(gradeExist)) throw error.DATA_NOT_FOUND;

      if (course_id) {
        const courseExist = findGrade.find((o) => +o.course_id === +course_id);
        if (courseExist) throw error.DUPLICATE_DATA;
      }

      const course = await Course.findByPk(
        course_id ? course_id : gradeExist.course_id
      );
      if (!course) throw error.FK_NOT_FOUND;

      let grades = [];
      if (lettered_grade) {
        const calculateGrades = grading(lettered_grade, +course.credit);
        grades.push(
          calculateGrades.numbered_grade,
          calculateGrades.credit_grade
        );
      }

      const incomingUpdate = updater(
        {
          lettered_grade,
          course_id,
          numbered_grade: grades[0],
          credit_grade: grades[1],
        },
        {}
      );
      if (isEmpty(incomingUpdate)) throw error.EMPTY_BODY;

      const result = await Grade.update(
        {
          ...incomingUpdate,
        },
        {
          where: { id: id, user_id: req.user.id },
          returning: true,
          plain: true,
        }
      );
      return res.status(201).json({
        status: "Success",
        data: result[1],
      });
    } catch (err) {
      next(err);
    }
  },

  //Menghapus data nilai
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
