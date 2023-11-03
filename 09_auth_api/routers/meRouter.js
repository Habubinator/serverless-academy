const Router = require("express");
const controller = require("../controllers/meController");
const router = new Router();

router.get("/", controller.getMe)

module.exports = router