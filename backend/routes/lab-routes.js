const express = require("express");

const labController = require("../controllers/lab-controller");
const syncLabsController = require("../controllers/Sync_labController");

const router = express.Router();

router.post("/new", labController.addlab);

router.post("/update", labController.updatelab);

router.get("/fetchLab/:calibmaster_lab_id", labController.fetchLab);

router.post("/postLabData", syncLabsController.postLabData)

module.exports = router;