const express = require("express");

const Authorization = require("../middleware/check-auth");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.post("/login", usersController.login);

router.post("/adduser", usersController.adduser);

router.post("/deleteuser", usersController.deleteuser);

module.exports = router;
