const express = require("express");

const labController = require("../controllers/lab-controller");

const router = express.Router();

router.post("/new", labController.addlab);

router.get("/fetchLab/:calibmaster_lab_id", labController.fetchLab);

module.exports = router;