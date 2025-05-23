const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");

const Post = require("../model/Post");

const User = require("../model/User");

const File = require("../model/File");



const postCtrl = {



  createPost: asyncHandler(async (req, res) => {

    console.log("I am inside createPost")
   
    const userFound = await User.findById(req.user);


    console.log(userFound);

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

    //! Save the user
    await userFound.save();

    return res.status(201).json({ message: "post created succesfully", post });
  }),

  deletePost: asyncHandler(async (req, res) => {

      const { id } = req.params;

      // Find the post and verify the user owns it
      const post = await Post.findOne({ _id: id, author: req.user });

      if (!post) {
        return res.status(404).json({
          status: "Failed",
          message: "you don't have permission to delete this post",
        });
      }

      // Delete the post

      // {new:true} doesnt show any effect on delete
      const afterDeletion = await Post.findByIdAndDelete(id);

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
    
  }),

  getAllPost: asyncHandler(async (req, res) => {
    const posts = await Post.find().populate("author", "username");

    res.status(201).json({  posts });

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
      posts,
    });
  }),



  //! Search Post

  searchPost: asyncHandler(async (req, res) => {
    const { query } = req;

    const posts = await Post.find(query).populate("author", "username email");

    res.status(200).json({
      status: "Success",
      message: "Search results",
      count: posts.length,
      posts,
    });
  }),



  //! Update the post


  updateCertainPost: asyncHandler(async (req, res) => {

    const { id } = req.params;

    const { title, description } = req.body;

    // Find the post and verify the user owns it
    const post = await Post.findOne({ _id: id, author: req.user });

    if (!post) {
      return res.status(404).json({
        status: "Failed",
        message: " you don't have permission to update this post",
      });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    res.json({
      status: "Success",
      message: "Post updated successfully",
      updatedPost,
    });






  })





};



 



module.exports = postCtrl;
