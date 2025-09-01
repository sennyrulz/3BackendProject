import Product from '../models/product.model.js';
import Admin from '../models/admin.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';


// ================= Create Product =================
export const createProducts = async (req, res) => {
  const { productName, desc, price, materials, features, categories, sizes } = req.body;
  const { _id, Admin } = req.user;
  const files = req.files;

  if (!productName || !desc || !price || !materials || !features || !categories || !sizes) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!files?.previewPix || !files?.image1 || !files?.image2) {
    return res.status(400).json({ message: 'Preview, image1, and image2 are required' });
  }

  try {
    // Upload images
    const previewPixResponse = await uploadToCloudinary(files["previewPix"][0].buffer);
    const image1Response = await uploadToCloudinary(files["image1"][0].buffer);
    const image2Response = await uploadToCloudinary(files["image2"][0].buffer);

    // Create product
    const newProduct = new Product({
      admin: _id,
      previewPix: {
        publicId: previewPixResponse.public_id,
        size: previewPixResponse.bytes,
        url: previewPixResponse.secure_url
      },
      Img1: [
        { publicId: image1Response.public_id, 
          size: image1Response.bytes, 
          url: image1Response.secure_url 
        }
      ],
      Img2: [
        { publicId: image2Response.public_id, 
          size: image2Response.bytes, 
          url: image2Response.secure_url 
        }
      ],
      productName,
      desc,
      price,
      materials,
      features,
      categories,
      sizes
    });

    const savedProduct = await newProduct.save();

    await Admin.findByIdAndUpdate(
      _id,
      { $push: { products: savedProduct._id } },
      { new: true }
    );

    return res.status(201).json({ message: "Product created successfully", product: savedProduct });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ================= Get Products =================
export const getProducts = async (req, res) => {
  const { _id, admin } = req.query;
  if(!admin) {
    return res.json({message: "You are not an authorised admin"})
  }

  try {
    const products = await Product.find({ admin: _id });
    return res.json(products);
    
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// ================= Update Product =================
export const updateProducts = async (req, res) => {
  const { productId } = req.body;
  const { _id, admin } = req.user;
  const body = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product does not exist" });
    }

    if (String(product.admin) !== String(_id) && !admin) {
      return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, { ...body }, { new: true });
    return res.json({ message: "Product updated successfully", product: updatedProduct });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= Delete Product =================
export const deleteProducts = async (req, res) => {
  const { productId } = req.query;
  const { _id, admin } = req.user;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product does not exist" });
    }

    if (String(product.admin) !== String(_id) && !admin) {
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(productId);
    return res.json({ message: "Product deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
