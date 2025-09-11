import {v2 as cloudinary} from "cloudinary";
import { streamUpload } from "./streamUpload.js";
import dotenv from "dotenv"

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file buffer to Cloudinary using streamifier
  export const uploadToCloudinary = async (fileBuffer, folder) => {
  return await streamUpload(fileBuffer, { folder });
};

export default cloudinary;