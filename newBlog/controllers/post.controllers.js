import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import { streamUpload} from "../utils/streamUpload.js";

//============= Create a Post ===================
export const createPost = async (req, res) => {
    const { title, desc, category } = req.body;
    const { _id } = req.user;
    const files = req.files;

    if (!title || !desc || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!files?.previewPix || !files?.Img1 || !files?.Img2 || !files?.Img3) {
        return res.status(400).json({ message: "Preview, Img1, Img2 and Img3 are required" });
    }

    try {
        // check if uploader is admin
        const isAdmin = await Admin.exists({ _id });

        // Upload images
        const previewPixResponse = await streamUpload(req.files.previewPix[0].buffer);
        const image1Response   = await streamUpload(req.files.Img1[0].buffer);
        const image2Response   = await streamUpload(req.files.Img2[0].buffer);
        const image3Response   = await streamUpload(req.files.Img3[0].buffer);


        // Create post
        const newPost = new Post({
            postedBy: {
                id: _id,
                role: isAdmin ? "Admin" : "User",
            },
            title,
            desc,
            category,
            previewPix: {
                publicId: previewPixResponse.public_id,
                size: previewPixResponse.bytes,
                url: previewPixResponse.secure_url,
            },
            Img1: [
                { publicId: image1Response.public_id, size: image1Response.bytes, url: image1Response.secure_url }
            ],
            Img2: [
                { publicId: image2Response.public_id, size: image2Response.bytes, url: image2Response.secure_url }
            ],
            Img3: [
                { publicId: image3Response.public_id, size: image3Response.bytes, url: image3Response.secure_url }
            ],
        });

        const savedPost = await newPost.save();

        // attach post to uploader
        let uploadedDoc;
        if (isAdmin) {
            uploadedDoc = await Admin.findByIdAndUpdate(
                _id,
                { $push: { posts: savedPost._id } },
                { new: true }
            );
        } else {
            uploadedDoc = await User.findByIdAndUpdate(
                _id,
                { $push: { posts: savedPost._id } },
                { new: true }
            );
        }

        return res.status(201).json({
            message: "Post successfully created",
            post: savedPost,
            postedBy: isAdmin ? "Admin" : "User",
            uploadedDoc,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

//======================== Get Posts ==============================
export const getPost = async (req, res) => {
    try {
        const posts = await Post
        .find()
        .populate("postedBy.id");
        return res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

//======================== Update Post ==============================
export const updatePost = async (req, res) => {
    const { postId } = req.body;
    const { _id } = req.user;
    const body = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post does not exist");

    // check ownership
    if (String(post.postedBy.id) !== String(_id)) {
        return res.status(403).send("You cannot update this post");
    }

    try {
        const updated = await Post.findByIdAndUpdate(postId, { ...body }, { new: true });
        res.json({ message: "Post updated successfully", post: updated });
    } catch (error) {
        return res.status(500).json({ message: "Error updating post" });
    }
};

//======================== Delete Post ==============================
export const deletePost = async (req, res) => {
    const { postId } = req.query;
    const { _id } = req.user;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).send("Post does not exist");

    // check ownership
    if (String(post.postedBy.id) !== String(_id)) {
        return res.status(403).send("You cannot delete this post");
    }

    try {
        await Post.findByIdAndDelete(postId);
        return res.json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Cannot delete post" });
    }
};

//======================== Error Page ==============================
export const errorPage = async (req, res) => {
    return res.status(404).json({ message: "This page does not exist" });
};
