import express from 'express';
import { }
import { authenticateAdmin } from '../middlewares/admin.middleware.js';
import { getAdminDashboard, updateProduct, deleteProduct } from '../controllers/admin.controller.js';

const route = express.Router();

// Admin Dashboard
route.post ('/login, loginAdmin, authenticateAdmin,')
route.get('/dashboard', authenticateAdmin, getAdminDashboard);

// Update Product
route.put('/product/:id', authenticateAdmin, updateProduct);

// Delete Product
route.delete('/product/:id', authenticateAdmin, deleteProduct);

export default route;