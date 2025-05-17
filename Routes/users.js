const express = require("express");
const userCtrl = require("../controller/user");

const isAuthenticated = require("../middleware/isAuth");

const userRoute = express.Router();

userRoute.post("/register", userCtrl.register);

userRoute.post("/login", userCtrl.login);

userRoute.get("/profile", isAuthenticated, userCtrl.Profile);

userRoute.put("/profile/edit", isAuthenticated, userCtrl.EditProfile);

userRoute.put("/profile/password", isAuthenticated, userCtrl.EditPassword);

module.exports = userRoute
