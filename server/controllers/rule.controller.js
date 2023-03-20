const { Rule, Specialization } = require("../db/models/");
const error = require("../misc/errorHandlers");
const updater = require("../helpers/updater");
const isEmpty = require("../helpers/emptyObjectCheck");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await Rule.findAll();
      // if (isEmpty(result)) throw error.EMPTY_TABLE;
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

      const result = await Rule.findOne({
        where: { id: id },
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
      const { condition, conclusion, connection, spec_id } = req.body;

      console.log(condition);

      const specExist = Specialization.findByPk(spec_id);
      if (!specExist) throw error.DATA_FK;

      const duplicate = await Rule.findOne({
        where: {
          condition: condition,
          conclusion: [conclusion],
          spec_id: spec_id,
        },
      });
      if (duplicate) throw error.DUPLICATE_DATA;

      const result = await Rule.create({
        condition: condition,
        conclusion: [conclusion],
        connection: connection,
        spec_id: spec_id,
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
      const { condition, conclusion, connection, spec_id } = req.body;
      const { id } = req.params;

      if (spec_id) {
        const specExist = await Specialization.findByPk(spec_id);
        if (!specExist) throw error.FK_NOT_FOUND;
      }

      const dataExist = await Rule.findOne({
        where: { id: id },
      });
      if (!dataExist) throw error.DATA_NOT_FOUND;

      const incomingUpdate = updater(
        { condition, conclusion, connection, spec_id },
        {}
      );
      if (isEmpty(incomingUpdate)) throw error.EMPTY_BODY;

      if (incomingUpdate.conclusion) {
        incomingUpdate.conclusion = [incomingUpdate.conclusion];
      } else if (incomingUpdate.condition) {
        incomingUpdate.condition = [incomingUpdate.condition];
      }

      const result = await Rule.update(
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
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Rule.destroy({
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
