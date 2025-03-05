const express = require("express");

const postCtrl = require("../controller/Post");

const isAuthenticated = require("../middleware/isAuth");

const postRoute = express.Router();

// console.log("Hello");

postRoute.post("/create", isAuthenticated, postCtrl.createPost);

postRoute.get("/get", postCtrl.viewPost);

postRoute.delete("/delete/:id", isAuthenticated, postCtrl.deletePost);

// router.get("/api/users/profile", isAuthenticated, userCtrl.Profile);

module.exports = postRoute;
