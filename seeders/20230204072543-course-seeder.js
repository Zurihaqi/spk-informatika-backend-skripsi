"use strict";

const courses = require("../data/mata_kuliah_konversi.json");

module.exports = {
  async up(queryInterface, Sequelize) {
    const courseData = courses.map((e) => {
      return {
        course_code: e.course_code.replace(/\s/g, ""),
        course_name: e.course_name.trim(),
        credit: parseInt(e.credit) + e.practicum_credit,
        semester: e.semester,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Courses", courseData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
