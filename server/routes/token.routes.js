const router = require("express").Router();
const controller = require("../controllers/token.controller");
const validation = require("../validations/token.validation");
const validate = require("../middlewares/validation");

router.get("/", validation.getAll(), validate, controller.getAll);
router.delete("/clear", controller.clearToken);

module.exports = router;
