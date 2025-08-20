import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { processCheckout } from '../controllers/checkout.controller.js';

const route = express.Router();

// Route to handle checkout process
route.post('/', authenticateToken, processCheckout);

// Route to get checkout details
route.get('/:id', processCheckout);

export default route;