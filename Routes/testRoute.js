const express = require("express");


const testController = require("../controller/Test.js");



const testRouter = express.Router();


testRouter.get("/", testController);


module.exports = testRouter;