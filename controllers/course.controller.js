const { Course } = require("../models/");
const error = require("../misc/errorHandlers");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const getAllResult = await Course.findAll();
      if (getAllResult[0] === undefined) throw error.EMPTY_TABLE;
      return res.status(201).json({
        status: "Success",
        data: getAllResult,
      });
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const getByIdResult = await Course.findByPk(id);
      if (getByIdResult) {
        return res.status(201).json({
          status: "Success",
          data: getByIdResult,
        });
      }
      throw error.DATA_NOT_FOUND;
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const { course_name, credit, grade_weight } = req.body;
      const checkForDuplicates = await Course.findOne({
        where: { course_name: course_name },
      });
      if (checkForDuplicates) throw error.DUPLICATE_DATA;
      const createCourseResult = await Course.create({
        course_name: course_name,
        credit: credit,
        grade_weight: grade_weight,
      });
      if (createCourseResult) {
        return res.status(201).json({
          status: "Success",
          data: createCourseResult,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { course_name, credit, grade_weight } = req.body;
      const { id } = req.params;
      if (Object.keys(req.body).length === 0) throw error.EMPTY_BODY;

      const checkIfDataExist = await Course.findByPk(id);
      if (!checkIfDataExist) throw error.DATA_NOT_FOUND;

      const updateCourseResult = await Course.update(
        {
          course_name: course_name,
          credit: credit,
          grade_weight: grade_weight,
        },
        {
          where: { id: id },
          returning: true,
          plain: true,
        }
      );
      if (updateCourseResult) {
        return res.status(201).json({
          status: "Success",
          data: updateCourseResult,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteCourseResult = await Course.destroy({
        where: { id: id },
      });
      if (!deleteCourseResult) throw error.DATA_NOT_FOUND;
      return res.status(201).json({
        status: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
};
