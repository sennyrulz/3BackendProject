import express from 'express';
import { createProducts, getProducts, updateProducts, deleteProducts } from '../controllers/adminProductController.js';
import { authenticateAdmin } from '../middlewares/admin.middleware.js';
import upload from "../utils/multer.js";

const route = express.Router();

const postUploads = upload.fields([
    {name: "previewPix", maxCount: 1},
    {name: "Img1", maxCount: 1},
    {name: "Img2", maxCount: 1}
])

//================= Product Routes =================
// Create Product
route.post('/create', authenticateAdmin, postUploads, createProducts);
// route.post('/create', authenticateAdmin, multer(array("images", 3)), arrayUpload, createProducts);

// Get Products
route.get('/', authenticateAdmin, getProducts);

// Update and Delete Products
route.put('/:id', authenticateAdmin, updateProducts);
route.delete('/:id', authenticateAdmin, deleteProducts);

export default route;