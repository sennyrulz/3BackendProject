import express from "express";
import { addToCart, getCart } from "../controllers/cart.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const route = express.Router();

// GET /cart → Get current user's cart
route.get("/", authenticateToken, getCart);
route.post("/", authenticateToken, addToCart);


export default route;
