import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv"

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

  export const uploadToCloudinary = async (fileBuffer, folder) => {
  return await cloudinary.uploader.upload(fileBuffer, { folder });
};

export default cloudinary;