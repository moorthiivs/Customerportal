const express = require("express");

const calibration = require("../controllers/calibration-controller");

const router = express.Router();

router.post("/create", calibration.create);

module.exports = router;
