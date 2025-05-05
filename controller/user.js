const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");

const User = require("../model/User");
const Post = require("../model/Post");

const userCtrl = {
  //!Register

  register: asyncHandler(async (req, res) => {
    console.log("Helllo i am register");
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
    const user = await User.findById(req.user).select("-password").populate({
      path: "posts",
      select: "title description images createdAt",
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json({ user, message: "Fetched Only my post" });
  }),

  EditProfile: asyncHandler(async (req, res) => {
    const { username } = req.body;

    //! Returned the document after updation takes place if new:true
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username },
      { new: true }
    ).select("-posts -password");

    res.status(201).json({ user: updatedUser });
  }),

  EditPassword: asyncHandler(async (req, res) => {
    //! Updating the password

    const { OldPassword } = req.body;

    const user = await User.findById(req.user);

    const isMatch = await bcrypt.compare(OldPassword, user.password);

    if (!isMatch) {
      return res
        .json({ message: "You cannot change the paasssword" })
        .status(401);
    }

    const { newPassword } = req.body;

    //!hash the password

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const userupdated = await User.findByIdAndUpdate(
      req.user,
      { password: hashedPassword },
      { new: true }
    ).select("-posts -password");

    res.json({ user: userupdated }).status(201);
  }),
};

module.exports = userCtrl;
