const router = require("express").Router();
const controller = require("../controllers/recommendation.controller");
const { isPengelola } = require("../middlewares/passport");

router.get("/all", isPengelola, controller.getAll);
router.get("/", controller.get);
router.delete("/", controller.delete);

module.exports = router;
