const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");

const User = require("../model/User");

const File = require("../model/File");

const userCtrl = {
  //!Register

  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    //! Validations
    if (!username || !email || !password || req.files.length === 0) {
      throw new Error("All fields are required");
    }

    console.log(req.body);

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

    // console.log(images)

    // console.log(images)

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

    images.map(async (profileimage) => {
      
      const userCreated = await User.create({
        username,
        password: hashedPassword,
        email,
        profileImageUrl: profileimage.url,
      });

      console.log(userCreated);

      //! send the response

      res.json({
        message: "Register Success",
        username: userCreated.username,
        email: userCreated.email,
        id: userCreated._id,
      });
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
    // console.log(user1);

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



    const { username, email } = req.body;


    //! Validations
    if(!username || !email){
      throw new Error("All fields are required");
    }

    
    const userFound = await User.findById(req.user);


    const {username1, email1} = userFound;


    //! Check if the user is trying to update the same username and email

    if(username1 === username || email1 === email){
      return res.status(400).json({message:"No changes made"});
    }


    //! Returned the document after updation takes place if new:true
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username, email },
      { new: true }
    ).select("-posts -password");


    // console.log(updatedUser);

    res.status(201).json({ message: "Updated Succesfully", user: updatedUser });
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

    res
      .json({ message: "Updated the password", user: userupdated })
      .status(201);
  }),
};

module.exports = userCtrl;
