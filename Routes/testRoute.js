const express = require("express");
const testController = require("../controller/Test");

const testRouter = express.Router();

testRouter.get("/", (req, res) => {
  const message = testController();
  res.send(message); // Send "Hello World" as the response
});

module.exports = testRouter;