import multer from "multer";

// Store files in memory (RAM) so we can stream them to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage })
// export const arrayUpload = multer({ storage }).array("Img", 10); // "images" is the field name
// upload.single("file") //for single uploads


export default upload;
