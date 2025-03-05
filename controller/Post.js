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

    console.log(postCreated);

    res.status(201).json({ message: "post created succesfully", postCreated });

    userFound.posts.push(postCreated);

    await userFound.save();
  }),

  deletePost: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    console.log(post);
  }),

  viewPost: asyncHandler(async (req, res) => {
    const posts = await Post.find();

    console.log(posts);

    res.status(201).json({ message: "viewed", posts });

    //
  }),
};

module.exports = postCtrl;
