import express from 'express';
import userRoute from "./routes/userRoute.js";
import kycRoute from "./routes/kycRoute.js";
import checkoutRoute from "./routes/checkoutRoute.js";
import adminRoute from "./routes/adminRoute.js";
import productRoute from "./routes/product.Route.js";
import cartRoute from "./routes/cart.route.js"

// Import necessary modules
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { urlencoded } from 'body-parser';
import dotenv from 'dotenv';



dotenv.config();
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:5007",
    "https://backend-axia-8-eCommerce.onrender.com",
    "https://axia-8-eCommerce.onrender.com"
  ],
  credentials: true
}));

// Routes
app.use("/api/user", userRoute);
app.use("/api/kyc", kycRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/admin", adminRoute); 
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);

// Server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
