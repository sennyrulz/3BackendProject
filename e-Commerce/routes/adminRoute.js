import express from 'express';
import { authenticateAdmin } from '../middlewares/admin.middleware.js';
import { createAdmin, loginAdmin } from '../controllers/admin.controller.js';
import { getAllUsers, getUser } from '../controllers/user.controller.js';

const route = express.Router();

// Admin Dashboard
route.post('/signup', createAdmin);
route.post ('/login', authenticateAdmin,loginAdmin)
route.get('/dashboard', authenticateAdmin, (req, res) => {
res.status(200).json({ message: 'Welcome to the Admin Dashboard' })});

route.get('users', getUser, getAllUsers)

export default route;