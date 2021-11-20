const router = require("express").Router();
const ridersControllers = require("../controllers/riders.controller");

router.get("/riders", ridersControllers.getAllRiders);

module.exports = router;
