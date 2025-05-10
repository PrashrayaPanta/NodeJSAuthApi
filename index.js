const express = require("express");

const cors = require("cors");

require("dotenv").config();

const app = express();

const router = require("./Routes/users");

const mongoose = require("mongoose");

const errorHandler = require("./middleware/errHandler");

const postRoute = require("./Routes/post");


const testRoute = require("./Routes/testRoute");

const PORT = process.env.PORT || 3000;

//allowing all the port to acess the backend server with ip.

app.use(cors());

//!Connect to mongodb

mongoose
  .connect(
    process.env.Mongodb_URI
  )

  .then(() => console.log("DB connected succesfully"))
  .catch((error) => console.log(error));

//!Middlewares

app.use(express.json()); //passing incoming json data from the client

//!Routes
app.use("/api/users", router);


app.use("/api/posts", postRoute);


app.use("/api/test",testRoute);



//!Error handler

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
