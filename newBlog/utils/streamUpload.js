import streamifier from 'streamifier'
import cloudinary from '../utils/cloudinary.js'

export const streamUpload = (buffer, folder = "posts") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto"}, 
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
