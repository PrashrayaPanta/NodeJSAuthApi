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

    userFound.posts.push(post)

    await userFound.save();


  }),

  deletePost: asyncHandler(async (req, res) => {


    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    const userFound = await User.findById(req.user);


    userFound.posts.pop(post);

    
    await userFound.save()

  }),

  viewPost: asyncHandler(async (req, res) => {

    console.log("Hello I am under view Post")
    const posts = await Post.find();


    res.status(201).json({ message: "viewed", posts });

    //
  }),
};

module.exports = postCtrl;
