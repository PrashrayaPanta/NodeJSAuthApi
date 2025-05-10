const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");

const Post = require("../model/Post");

const User = require("../model/User");

const File = require("../model/File");




const postCtrl = {
  createPost: asyncHandler(async (req, res) => {
    // const user = await User.findById(req.user).select("-password");

    // console.log(req.user)

    const userFound = await User.findById(req.user);

    const { title, description } = req.body;

    console.log(req.files);

    if (!title || !description || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: "Failed", message: "All Fields should certain value" });
    }

    // Upload  each image public_id and Url in db
    const images = await Promise.all(
      req.files.map(async (file) => {
        console.log("Getted all the object for sending to db");
        //Save the images into our database

        const newFile = new File({
          url: file.path,
          public_id: file.filename,
        });

        await newFile.save();

        console.log(newFile);

        return {
          url: newFile.url,
          public_id: newFile.public_id,
        };
      })
    );

    const post = await Post.create({
      title,
      description,
      author: req.user,
      images,
    });

    console.log(userFound);

    userFound?.posts.push(post);

    await userFound.save();

    return res.status(201).json({ message: "post created succesfully", post });
  }),

  deletePost: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;

      // Find the post and verify the user owns it
      const post = await Post.findOne({ _id: id, author: req.user });

      if (!post) {
        return res.status(404).json({
          status: "Failed",
          message: " you don't have permission to delete this post",
        });
      }

      // Delete the post
      const afterDeletion = await Post.findByIdAndDelete(id, { new: true });

      console.log(afterDeletion);

      // Remove the post from user's posts array
      await User.findByIdAndUpdate(
        req.user,
        { $pull: { posts: id } },
        { new: true }
      );

      res.json({
        status: "Success",
        message: "Post deleted successfully",
        deletedPost: afterDeletion,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: "Error deleting post",
        error: error.message,
      });
    }
  }),

  viewPost: asyncHandler(async (req, res) => {
    const posts = await Post.find().populate("author", "username");

    res.status(201).json({ message: "viewed", posts });

    //
  }),

  getCertainPost: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id).populate("author", "username");

    if (!post) {
      return res.status(404).json({
        status: "Failed",
        message: "Post not found",
      });
    }

    res.json({
      status: "Success",
      message: "Post fetched successfully",
      post,
    });
  }),

  LatestPosts: asyncHandler(async (req, res) => {
    const posts = await Post.find()
      .limit(2)
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("author", "username");

    // Extract only username not only field
    // .limit(5)
    // .populate("author", "username");

    // console.log(posts);

    res.status(201).json({
      status: "success",
      message: "Latest Post fetched succesfully",
      posts,
    });
  }),

  searchPost: asyncHandler(async (req, res) => {
    const { query } = req;

    const posts = await Post.find(query);

    res.status(200).json({
      status: "Success",
      message: "Search results",
      count: posts.length,
      posts,
    });
  }),
};



 



module.exports = postCtrl;
