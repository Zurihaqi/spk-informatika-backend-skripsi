const router = require("express").Router();
const controller = require("../controllers/notification.controller");
const { isAdmin } = require("../middlewares/passport");

router.get("/", controller.get);
router.post("/", isAdmin, controller.create);
router.delete("/", controller.delete);

module.exports = router;
