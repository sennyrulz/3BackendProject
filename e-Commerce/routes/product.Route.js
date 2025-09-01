import express from 'express';
import { createProducts, getProducts, updateProducts, deleteProducts } from '../controllers/adminProductController.js';
import { authenticateAdmin } from '../middlewares/admin.middleware.js';
import { arrayUpload } from '../controllers/admin.controller.js';
// import multer from 'multer';

const route = express.Router();

//================= Product Routes =================
// Create Product
route.post('/create', arrayUpload, createProducts);
// route.post('/create', authenticateAdmin, multer(array("images", 3)), arrayUpload, createProducts);

// Get Products
route.get('/', authenticateAdmin, getProducts);

// Update Product
route.put('/:id', authenticateAdmin, updateProducts);

// Delete Product
route.delete('/:id', authenticateAdmin, deleteProducts);

export default route;