const express = require("express");

const companyController = require("../controllers/company-controller");

const router = express.Router();

router.post("/new", companyController.newcompanyHandler);

router.get("/fetchCompany/:calibmaster_customer_id", companyController.fetchCompany);

module.exports = router;