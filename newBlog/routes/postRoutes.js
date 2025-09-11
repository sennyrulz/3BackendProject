import express from 'express'
import {authenticateToken} from '../middlewares/auth.middlewares.js'
import {createPost, getPost, updatePost, deletePost, errorPage} from "../controllers/post.controllers.js"
import upload from '../utils/multer.js';

const route = express.Router();

const postUploads = upload.fields([
    {name: "previewPix", maxCount: 1},
    {name: "Img1", maxCount: 1},
    {name: "Img2", maxCount: 1},
    {name: "Img3", maxCount: 1},
])

//================= Product Routes =================
// Create Product
route.post("/upload",authenticateToken, postUploads, createPost);

// Get Posts
route.get("/", authenticateToken, getPost);

// Update and Delete Products
route.put("/:id", authenticateToken, updatePost)
route.delete("/:id", authenticateToken, deletePost)

//Error
route.get("/404", errorPage)

export default route