import Product from '../models/product.model.js';
import Admin from '../models/admin.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';


// ================= Create Product =================
export const createProducts = async (req, res) => {
  try {
  const { productName, desc, price, materials, features, category, sizes } = req.body;
  const { _id } = req.admin;
  const files = req.files;

  if (!productName || !desc || !price || !materials || !features || !category || !sizes) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!files?.previewPix || !files?.Img1 || !files?.Img2) {
    return res.status(400).json({ message: 'PreviewPix, image1, and image2 are required' });
  }

  // Upload images to coudinary using streamifier
    const previewPixResponse = await uploadToCloudinary(files["previewPix"][0].buffer, "products");
    const image1Response = await uploadToCloudinary(files["Img1"][0].buffer, "products");
    const image2Response = await uploadToCloudinary(files["Img2"][0].buffer, "products");

    // Convert features/sizes/categories to arrays
    const featuresArray = features.split(',').map(f => f.trim());
    const sizesArray = sizes.split(',').map(s => s.trim());
    const categoryArray = category.split(',').map(c => c.trim());

    // Create product
    const newProduct = new Product({
      admin: _id,
      productName,
      desc,
      price,
      materials,
      features: featuresArray,
      category: categoryArray,
      sizes,
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
      ]
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


// ================= Error Page =================
export const errorPage = async (req, res, next) => {
  if (!createProducts, !getProducts, !updateProducts, !deleteProducts) {
    return res.status(404)({message: "This page does not exist"})
  }
  next();
};
