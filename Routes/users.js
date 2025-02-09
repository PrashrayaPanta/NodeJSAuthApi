const express = require("express");
const userCtrl = require("../controller/user");

const isAuthenticated = require("../middleware/isAuth");

const router = express.Router();

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

router.get("/profile", isAuthenticated, userCtrl.Profile);

module.exports = router;
