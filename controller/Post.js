const asyncHandler = require("express-async-handler");
const Post = require("../model/Post");


const User = require("../model/User");


const File = require("../model/File");


const postCtrl = {

  
  createPost: asyncHandler(async (req, res) => {
    // const user = await User.findById(req.user).select("-password");

    const userFound = await User.findById(req.user);


    // console.log("Hellobbhj ");
  
    console.log(userFound)

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

        console.log("Getted all the object for sending to db")
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


    res.status(201).json({ message: "post created succesfully", post });

    userFound.posts.push(post);

    


    // console.log(post);

   

    await userFound.save();


  }),

  deletePost: asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find the post and verify the user owns it
      const post = await Post.findOne({ _id: id, author: req.user });
      
      if (!post) {
        return res.status(404).json({ 
          status: "Failed", 
          message: " you don't have permission to delete this post" 
        });
      }

      // Delete the post
     const afterDeletion = await Post.findByIdAndDelete(id, {new: true});

      // Remove the post from user's posts array
      await User.findByIdAndUpdate(
        req.user,
        { $pull: { posts: id } },
        { new: true }
      );

      res.json({
        status: "Success",
        message: "Post deleted successfully",
        deletedPost: afterDeletion
      });
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: "Error deleting post",
        error: error.message
      });
    }
  }),

  viewPost: asyncHandler(async (req, res) => {

    const posts = await Post.find().populate("author", "username");


    res.status(201).json({ message: "viewed", posts });

    //
  }),
};

module.exports = postCtrl;
