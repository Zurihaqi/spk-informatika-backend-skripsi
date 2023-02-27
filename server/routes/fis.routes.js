const router = require("express").Router();
const controller = require("../controllers/fis.controller");
const validation = require("../validations/fis.validation");
const validate = require("../middlewares/validation");

router.post("/", validation.calculate(), validate, controller.calculate);

module.exports = router;
