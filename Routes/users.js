const express = require("express");
const userCtrl = require("../controller/user");
const isAuthenticated = require("../middleware/isAuth");

const router = express.Router();

router.post("/api/users/register", userCtrl.register);

router.post("/api/users/login", userCtrl.login);

router.get("/api/users/profile", isAuthenticated, userCtrl.Profile);

module.exports = router;
