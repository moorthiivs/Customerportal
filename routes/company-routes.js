const express = require("express");

const companyController = require("../controllers/company-controller");

const router = express.Router();

router.post("/new", companyController.newcompanyHandler);

module.exports = router;
