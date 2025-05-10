const Post = require("../model/Post");

const PostViewController = async(req, res, next) =>{

    try {
        const posts = await Post.find().populate("author", "username");

        res.status(201).json({ message: "viewed", posts });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: "Error fetching posts",
            error: error.message,
        });
    }


}


module.exports = PostViewController