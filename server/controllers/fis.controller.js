const { Rule, Grade, Course, Recommendation } = require("../db/models/");
const Op = require("sequelize").Op;
const fuzzyis = require("../helpers/fuzzyis/");
const { LinguisticVariable, Term, FIS } = fuzzyis;
const Rules = fuzzyis.Rule;
const error = require("../misc/errorHandlers");

module.exports = {
  calculate: async (req, res, next) => {
    try {
      const { spec } = req.query;

      const [courses, ruleSets, grades] = await Promise.all([
        Course.findAll({ raw: true }),
        Rule.findAll({ raw: true }),
        Grade.findAll({ raw: true }),
      ]);

      const fisMap = new Map();
      fisMap.set("software-dev", new FIS("SPK Software Development"));
      fisMap.set("data-science", new FIS("SPK Data Science"));
      fisMap.set("networking", new FIS("SPK Networking"));

      const linguisticVariables = {
        "software-dev": [],
        "data-science": [],
        networking: [],
      };

      const output = new LinguisticVariable("rekomendasi", [0, 1]);

      const inputTerms = [
        new Term("rendah", "triangle", [0.0, 1.0, 2.0]),
        new Term("sedang", "triangle", [1.5, 2.5, 3.5]),
        new Term("tinggi", "triangle", [3.0, 4.0, 4.0]),
      ];

      const outputTerms = [
        new Term("tidak-disarankan", "triangle", [0, 0, 0.5]),
        new Term("disarankan", "triangle", [0.5, 1, 1]),
      ];

      outputTerms.forEach((e) => {
        output.addTerm(e);
      });

      for (const fis of fisMap.values()) {
        fis.addOutput(output);
      }

      const result = {};

      if (spec === "software-dev" || spec === "all") {
        const softDev = fisMap.get("software-dev");

        courses.forEach((e) => {
          if (e.spec_id === 1) {
            linguisticVariables["software-dev"].push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            );
          }
        });

        for (const linguisticVariable of linguisticVariables["software-dev"]) {
          inputTerms.forEach((term) => {
            linguisticVariable.addTerm(term);
          });
          softDev.addInput(linguisticVariable);
        }

        const softDevRules = ruleSets.filter((e) => e.spec_id === 1);
        if (!softDevRules.length) throw error.RULE_NOT_FOUND;
        softDevRules.forEach((e) => {
          softDev.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        const softDevGrades = grades
          .filter((o) => {
            const course = courses.find((c) => c.id === o.course_id);
            return course && course.spec_id === 1 && o.user_id === req.user.id;
          })
          .map((o) => o.numbered_grade);

        if (softDevGrades.length !== linguisticVariables["software-dev"].length)
          throw error.GRADE_NOT_FOUND;
        result.software_development = +softDev
          .getPreciseOutput(softDevGrades)[0]
          .toFixed(2);
      }

      if (spec === "data-science" || spec === "all") {
        const dataSci = fisMap.get("data-science");

        courses.forEach((e) => {
          if (e.spec_id === 2) {
            linguisticVariables["data-science"].push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            );
          }
        });

        for (const linguisticVariable of linguisticVariables["data-science"]) {
          inputTerms.forEach((term) => {
            linguisticVariable.addTerm(term);
          });
          dataSci.addInput(linguisticVariable);
        }

        const dataSciRules = ruleSets.filter((e) => e.spec_id === 2);
        if (!dataSciRules.length) throw error.RULE_NOT_FOUND;
        dataSciRules.forEach((e) => {
          dataSci.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        const dataSciGrades = grades
          .filter((o) => {
            const course = courses.find((c) => c.id === o.course_id);
            return course && course.spec_id === 2 && o.user_id === req.user.id;
          })
          .map((o) => o.numbered_grade);

        if (dataSciGrades.length !== linguisticVariables["data-science"].length)
          throw error.GRADE_NOT_FOUND;
        result.data_science = +dataSci
          .getPreciseOutput(dataSciGrades)[0]
          .toFixed(2);
      }

      if (spec === "networking" || spec === "all") {
        const networking = fisMap.get("networking");

        courses.forEach((e) => {
          if (e.spec_id === 3) {
            linguisticVariables["networking"].push(
              new LinguisticVariable(e.course_name, [0.0, 4.0])
            );
          }
        });

        for (const linguisticVariable of linguisticVariables["networking"]) {
          inputTerms.forEach((term) => {
            linguisticVariable.addTerm(term);
          });
          networking.addInput(linguisticVariable);
        }

        const networkingRules = ruleSets.filter((e) => e.spec_id === 3);
        if (!networkingRules.length) throw error.RULE_NOT_FOUND;
        networkingRules.forEach((e) => {
          networking.rules.push(
            new Rules(e.condition, e.conclusion, e.connection)
          );
        });

        const networkingGrades = grades
          .filter((o) => {
            const course = courses.find((c) => c.id === o.course_id);
            return course && course.spec_id === 3 && o.user_id === req.user.id;
          })
          .map((o) => o.numbered_grade);

        if (
          networkingGrades.length !== linguisticVariables["networking"].length
        )
          throw error.GRADE_NOT_FOUND;
        result.networking = +networking
          .getPreciseOutput(networkingGrades)[0]
          .toFixed(2);
      }

      if (
        result.software_development === 0 ||
        result.data_science === 0 ||
        result.networking === 0
      ) {
        throw error.FIS_ERROR;
      }

      if (
        result.software_development &&
        result.data_science &&
        result.networking
      ) {
        const sum =
          result.software_development + result.data_science + result.networking;

        result.softDevPercentage = Math.round(
          (result.software_development / sum) * 100
        );
        result.dataSciPercentage = Math.round(
          (result.data_science / sum) * 100
        );
        result.networkingPercentage = Math.round(
          (result.networking / sum) * 100
        );

        const getRecs = await Recommendation.findAll({
          where: { user_id: req.user.id },
          order: [["createdAt", "DESC"]],
        });

        const recCount = getRecs.length;
        const recLimit = 3;

        if (recCount >= recLimit) {
          const oldestRecs = getRecs.slice(recLimit - 1);

          await Recommendation.destroy({
            where: {
              user_id: req.user.id,
              id: {
                [Op.in]: oldestRecs.map((rec) => rec.id),
              },
            },
          });
        }

        const createRecs = await Recommendation.create({
          crispOutput: [
            result.software_development.toFixed(2),
            result.data_science.toFixed(2),
            result.networking.toFixed(2),
          ],
          percentage: [
            result.softDevPercentage,
            result.dataSciPercentage,
            result.networkingPercentage,
          ],
          user_id: req.user.id,
        });

        if (createRecs) {
          return res.status(201).json({
            status: "Success",
            result: result,
          });
        }
      } else {
        throw error.FIS_ERROR;
      }
    } catch (err) {
      next(err);
    }
  },
};
