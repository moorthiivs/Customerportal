const express = require("express");

const Authorization = require("../middleware/check-auth");

const usersController = require("../controllers/users-controller");
const syncUserController = require("../controllers/Sync_userController");

const router = express.Router();

router.post("/login", usersController.login);

router.post("/adduser", usersController.adduser);

router.post("/deleteuser", usersController.deleteuser);

router.get("/fetchClient/:calibmaster_client_id", usersController.fetchClient);

router.post("/postUserData", syncUserController.postUserData)

module.exports = router;
