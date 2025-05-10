const express = require("express");

const postCtrl = require("../controller/Post");

const isAuthenticated = require("../middleware/isAuth");

const postRoute = express.Router();

const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("cloudinary").v2;

//! Configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//!Configure multer storage cloudinary

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nodejscreatepost",
    allowedFormat: ["png", "jpeg"],
    // public_id: (req, file) => file.fieldname + "_" + Date.now(),
  },
});

///!Configure Multer

const upload = multer({
  storage,
  limits: 1024 * 1024 * 5, //5MB LIMIt
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image plz upload an image", false));
    }
  },
});

postRoute.post(
  "/create",
  isAuthenticated,
  upload.array("images"),
  postCtrl.createPost
);

postRoute.get("/get", postCtrl.viewPost);

postRoute.get("/get/latestpost", postCtrl.LatestPosts);

postRoute.get("/get/search", postCtrl.searchPost);

postRoute.get("/get/:id", postCtrl.getCertainPost);

postRoute.delete("/delete/:id", isAuthenticated, postCtrl.deletePost);

module.exports = postRoute;
