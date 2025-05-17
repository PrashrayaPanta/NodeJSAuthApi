const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const ServerResponse = require("../utils/serverResponse");

const userCtrl = {
  //! Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("This email has already been registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userCreated = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    ServerResponse(res, 201, {
      id: userCreated._id,
      username: userCreated.username,
      email: userCreated.email,
    }, "Register Success");
  }),

  //! Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, "anykey", { expiresIn: "30d" });

    ServerResponse(res, 200, {
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    }, "Login Success");
  }),

  //! Profile
  Profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select("-password").populate({
      path: "posts",
      select: "title description images createdAt",
    });

    if (!user) {
      return ServerResponse(res, 404, null, "User Not Found");
    }

    ServerResponse(res, 200, user, "Fetched Profile Successfully");
  }),

  //! Edit Profile
  EditProfile: asyncHandler(async (req, res) => {
    const { username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username },
      { new: true }
    ).select("-posts -password");

    ServerResponse(res, 200, updatedUser, "Profile Updated Successfully");
  }),

  //! Edit Password
  EditPassword: asyncHandler(async (req, res) => {
    const { OldPassword, newPassword } = req.body;

    const user = await User.findById(req.user);
    const isMatch = await bcrypt.compare(OldPassword, user.password);

    if (!isMatch) {
      return ServerResponse(res, 401, null, "Old password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const userUpdated = await User.findByIdAndUpdate(
      req.user,
      { password: hashedPassword },
      { new: true }
    ).select("-posts -password");

    ServerResponse(res, 200, userUpdated, "Password Updated Successfully");
  }),
};

module.exports = userCtrl;
