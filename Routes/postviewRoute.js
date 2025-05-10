const express = require("express");


const postviewController = require("../controller/PostViewController.js");



const postviewroute = express.Router();




postviewroute.get("/", postviewController);



module.exports = postviewroute;