import express from 'express'
import {authenticateToken} from '../middlewares/auth.middlewares.js'
import {createPost, getPost, updatePost, deletePost, errorPage} from "../controllers/post.controllers.js"
import { arrayUpload } from '../controllers/user.controllers.js';

const route = express.Router();

//uploads
route.post("/upload", arrayUpload, createPost);

//posts
route.get("/", authenticateToken, getPost);
route.put("/id", authenticateToken, updatePost)
route.delete("/id", authenticateToken, deletePost)

//Error
route.get("/404", errorPage)

export default route