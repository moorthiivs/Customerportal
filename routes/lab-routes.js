const express = require("express");

const labController = require("../controllers/lab-controller");

const router = express.Router();

router.post("/new", labController.addlab);

module.exports = router;