const express = require("express");

const companyController = require("../controllers/company-controller");
const syncCustomerController = require("../controllers/Sync_companyController");

const router = express.Router();

router.post("/new", companyController.newcompanyHandler);

router.post("/update", companyController.updatecompanyhandler);

router.get("/fetchCompany/:calibmaster_customer_id", companyController.fetchCompany);

router.post("/postCustomerData", syncCustomerController.postCompanyData);

module.exports = router;