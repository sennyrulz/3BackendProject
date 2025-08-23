import express from "express"
import userRoute from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js"
import blogRoute from "./routes/blogRoutes.js"

import mongoose from 'mongoose'
import cookieParser from 'cookier-parser'
import { urlencoded } from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();
const app = express();

mongoose 
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connection successful"))
    .catch((err) => console.error("MongoDB connection error:", err.message));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

   app.use(cors({
     origin: [
       "http://localhost:5008",
       "https://backend-axia-8-Blog.onrender.com",
       "https://axia-8-Blog.onrender.com"
     ],
     credentials: true
   }));

    app.use("/api/user", userRoute);
    app.use("/api/admin", adminRoute);
    app.use("/api/Blog", blogRoute);

    //server
    const PORT = process.env.PORT || 5008;
    app.listen(PORT, () => {
        console.log(`Server is running on port${PORT}`);
    });