import express from 'express';
import { authenticateAdmin } from '../middlewares/admin.middleware.js';
import { createAdmin, loginAdmin, errorPage } from '../controllers/admin.controller.js';

const route = express.Router();

// Auth
route.post('/signup', createAdmin);
route.post ('/login',loginAdmin)

//Protected Route
route.get('/:id/dashboard', authenticateAdmin, (req, res) => {
res.status(200).json({ message: 'Welcome to the Admin Dashboard' })});

//Error
route.get("/404", errorPage);

export default route;