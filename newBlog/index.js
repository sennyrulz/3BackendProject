import express from "express";
import userRoute from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import postRoute from "./routes/postRoutes.js";

//Import necessary modules
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {console.log("✅ MongoDB connection successful");})
  .catch((err) => console.log("❌ MongoDB connection error:"));

// middleware
app.use(express.json());
app.use(
  express.text({ 
  type: ["application/javascript", "text/plain", "text/html", "application/xml"]}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5007", "http://localhost:3000", "https://blog-project-frontend.vercel.app"],
    credentials: true,
  })
);

// routes or endpoints
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/post", postRoute);


// Server
const PORT = process.env.PORT || 5007;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });

// global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
