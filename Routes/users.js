const express = require("express");
const userCtrl = require("../controller/user");

const isAuthenticated = require("../middleware/isAuth");


const userRoute = express.Router();


const cloudinary = require("cloudinary").v2;




const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");




//! Configure cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });



const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nodejsProfileImage",
    allowedFormat: ["png", "jpeg"],
    // public_id: (req, file) => file.fieldname + "_" + Date.now(),
  },
});




///!Configure Multer for uploading image

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

userRoute.post("/register", upload.array("image"), userCtrl.register);

userRoute.post("/login", userCtrl.login);

userRoute.get("/profile", isAuthenticated, userCtrl.Profile);

userRoute.put("/profile/edit", isAuthenticated, userCtrl.EditProfile);

userRoute.put("/profile/password", isAuthenticated, userCtrl.EditPassword);

module.exports = userRoute
