const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");

const User = require("../model/User");

const userCtrl = {
  //!Register

  register: asyncHandler(async (req, res) => {
    // res.json({message: "Register"})

    const { username, email, password } = req.body;

    console.log(req.body);

    //! Validations
    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    //! check if user alreday exist

    const userExist = await User.findOne({ email });

    if (userExist) {
      //   console.log("Hello");
      throw new Error("This email has been already regfister");
    }

    //! Hash the user password

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    //! create the user

    const userCreated = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    //! send the response

    res.json({
      message: "Register Success",
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),

  //!Login

  login: asyncHandler(async (req, res) => {
    // res.json({message:"Login"})

    const { email, password } = req.body;

    //! check if user email exits

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid ceredentials");
    }

    //! check if user password is valid

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid ceredentials");
    }

    //! Genrate the token

    const token = jwt.sign({ id: user._id }, "anykey", { expiresIn: "30d" });

    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  //! Profile

  Profile: asyncHandler(async (req, res) => {
    //find the user

    const user = await User.findById(req.user).select("-password");
    console.log(req.user);

    res.json({ user });

    //     console.log(user)
  }),
};

module.exports = userCtrl;
