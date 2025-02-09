const asyncHandler = require("express-async-handler");
const Post = require("../model/Post");
const User = require("../model/User");

const postCtrl = {
  createPost: asyncHandler(async (req, res) => {
    // const user = await User.findById(req.user).select("-password");

    const userFound = await User.findById(req.user);

    const { title, description } = req.body;

    const postCreated = await Post.create({
      title,
      description,
      author: req.user,
    });

    userFound.posts.push(postCreated);

    await userFound.save();
  }),

  viewPost: asyncHandler(async (req, res) => {
    const posts = await Post.find();

    console.log(posts);

    //
  }),
};

module.exports = postCtrl;
