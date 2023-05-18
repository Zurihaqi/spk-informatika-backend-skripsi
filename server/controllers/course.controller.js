const { Course } = require("../db/models/");
const error = require("../misc/errorHandlers");
const updater = require("../helpers/updater");
const isEmpty = require("../helpers/emptyObjectCheck");

module.exports = {
  //Ambil seluruh data mata kuliah dalam database
  getAll: async (req, res, next) => {
    try {
      const result = await Course.findAll();
      // if (isEmpty(result)) throw error.EMPTY_TABLE;

      return res.status(201).json({
        status: "Success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  //Ambil data mata kuliah sesuai ID yang dicari dari database
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

  //Membuat data mata kuliah baru
  create: async (req, res, next) => {
    try {
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

  //Update data mata kuliah yang dipilih sesuai ID
  update: async (req, res, next) => {
    try {
      const { course_code, course_name, credit, semester, spec_id } = req.body;
      const { id } = req.params;

      const dataExist = await Course.findByPk(id);
      if (!dataExist) throw error.DATA_NOT_FOUND;

      const incomingUpdate = updater(
        { course_code, course_name, credit, semester, spec_id },
        {}
      );
      if (incomingUpdate.spec_id == 0) incomingUpdate.spec_id = null;
      if (isEmpty(incomingUpdate)) throw error.EMPTY_BODY;

      const result = await Course.update(
        {
          ...incomingUpdate,
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
          data: result[1],
        });
      }
    } catch (err) {
      next(err);
    }
  },

  //Menghapus data mata kuliah sesuai ID yang dipilih
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const course = await Course.findByPk(id);
      if (course.spec_id !== null) throw error.COURSE_SPEC_ASSOC;

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
