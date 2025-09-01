import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Admin from "../../e-Commerce/models/admin.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


//============= Create a Post===================
export const createPost = async (req, res) => {
    const {title,desc} = req.body;
    const {_id, User, Admin} = req.user
    const files = req.files;

    if (!title, !desc) {
        return res.json({message: "All fields are required"})
    };

    if (!files?.previewPix || !files?.image2 || !files?.image3 || !files?.image4) {
        return res.status(400).json({message:"Preview, image2, image3 and image4 are required"})
    }

    try {
    // Upload images
        const previewPixResponse = await uploadToCloudinary(files["previewPix"][0].buffer);
        const image2Response = await uploadToCloudinary(files["image2"][0].buffer);
        const image3Response = await uploadToCloudinary(files["image3"][0].buffer);
        const image4Response = await uploadToCloudinary(files["image4"][0].buffer);

    //Create Post
    const newPost = new Post({
        admin: _id,
        user: _id,
        previewPix: {
        publicId: previewPixResponse.public_id,
        size: previewPixResponse.bytes,
        url: previewPixResponse.secure_url
        },
        Img2: [
            { publicId: image2Response.public_id, 
            size: image2Response.bytes, 
            url: image2Response.secure_url 
            }
        ],
        Img3: [
            { publicId: image3Response.public_id, 
            size: image3Response.bytes, 
            url: image3Response.secure_url 
            }
        ],
        Img4: [
            { publicId: image4Response.public_id, 
            size: image4Response.bytes, 
            url: image4Response.secure_url 
            }
        ],
        title,
        desc,
    });

    const savedPost = await newPost.save();

    await Admin.findByIdAndUpdate(
        _id,
          { $push: { products: savedPost._id } },
          { new: true }
        );

    await User.findByIdAndUpdate(
        _id,
            { $push: { products: savedPost._id } },
            { new: true }
        );

        return res.status(201).json({message:"Post successfully created", post})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
}

//======================== Get Posts ==============================
export const getPost = async (req,res) => {
    const {_id} = req.query;
     if(!admin || !user) {
    return res.json({message: "You are not authorised for this operation"})
  }

  try {
    const posts = await Post.find({admin:_id})
        return res.json(posts);

  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updatePost = async (req, res) => {
    const {_id, ...others} = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            _id,
            {...others},
            {new: true}
        );
            return res.json(updatedPost);
    } catch (error) {
        return res.json({message: "error uploading post"})
    }
}

export const deletePost = async (req, res) => {
    const {_id} = req.query;
    try {
        const deletedPost = await Post.findByIdAndDelete
        (_id);
        return res.json(deletedPost);
    } catch (error) {
     console.error("Delete error:", error);
        return res.status(500).json({ error: "Cannot delete Post" });
    }
};

export const errorPage = async (req, res, next) => {
    if (!createPost, !getPost) {
        return res.status(404)({message: "This page does not exist"})
    }
    if(!user) {
        return res.status(404).json({ error: "This account does not exist, create an account!"});
    };
}