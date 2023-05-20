const router = require("express").Router();
const controller = require("../controllers/fisStats.controller");
const { isPengelola } = require("../middlewares/passport");

router.get("/", isPengelola, controller.getStats);

module.exports = router;
