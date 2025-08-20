import productModel from '../models/productModel.js';
import adminModel from '../models/adminModel.js';
import cloudinary from 'cloudinary'
import streamifier from 'streamifier'

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({ folder: 'products' }, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Create a new product
export const createProducts = async (req, res) => {
  const { productName, desc, features, materials, sizes, price } = req.body;
  const files = req.files;
  const {_id, admin} = req.user;

   if (_id == product.admin && admin) {
    return res.send("post created successfully");
    } 

  if (!productName || !desc || !price || !materials || !features || !sizes ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!req.files || req.files.length < 3) {
    return res.status(400).json({ message: 'At least three images are required' });
  }

//   try {
//     const imageUrls = await Promise.all(
//       req.files.map(file => uploadToCloudinary(file.buffer))
//     );

    const previewPixResponse = await streamUpload(files["previewPix"][0].buffer, "images");
    const image1Response = await streamUpload(files["image1"][0].buffer, "images");
    const image2Response = await streamUpload(files["image2"][0].buffer, "images");
  

    const newProduct = new productModel({
      user: id,
      productName,
      desc,
      features,
      materials,
      sizes,
      price,
      pictures: imageUrls
    });

    const savedProduct = await newProduct.save();
    // return res.status(201).json(savedProduct);
    await userModel.findByIdAndUpdate (
    id, 
    { $push: { products: savedProduct.id }}, 
    { new: true }
  );
return res.send("post created successfuly!!!");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
     const {adminId} = req.query
    try {
      const products = await productModel.find({admin:adminId});
      return res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.send( 'Something went wrong' );
    }
};

// Update an existing product
export const updateProducts = async(req, res) => {
  const { productId, userId } = req.body;
  const body = req.body;

  const product = await productModel.findById(productId);
    if(!product){
      return res.send("product does not exist")
    }
    //check if the owner
    if(userId != product.admin){
      res.send("products does not belong to you. You cannot update this products")
    }

    if (_id != post.admin && !admin) {
      return res.send("Unable to delete. You are not the owner");
    } 

    try {
      await productModel.findByIdAndUpdate(productId, {...body}, {new: true});  
      res.send("product updated successfully")
    } catch (error) {
      return res.send("something went wrong")
    }
};

// Delete a product
export const deleteProducts = async (req, res) => {
    const {productId} = req.query;
    const {id, admin} = req.user;

 //check for product existence
    const product = await productModel.findById(productId);
      if(!product){
        return res.send("product does not exist")
      }
      console.log(admin);
      console.log(product.admin);
  //check if its the admin deleting product
    if (id != product.admin && !admin) {
      return res.send("Unable to delete this product. you are not the owner");
    }

   try {
      await productModel.findByIdAndDelete(productId)
      return res.send("product deleted successfully!!!") 
           
    } catch (error) {
      return res.send(error.message)
    }
  };
