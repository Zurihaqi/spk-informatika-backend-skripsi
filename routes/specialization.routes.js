const router = require("express").Router();
const controller = require("../controllers/specialization.controller");
const validation = require("../validations/specialization.validation");
const validate = require("../middlewares/validation");

router.get("/", controller.getAll);
router.get("/:id", validation.getById(), validate, controller.getById);
router.post("/", validation.create(), validate, controller.create);
router.patch("/:id", validation.update(), validate, controller.update);
router.delete("/:id", validation.delete(), validate, controller.delete);

module.exports = router;
