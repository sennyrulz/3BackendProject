import { streamUpload } from "../../newBlog/utils/streamUpload.js";
import Product from "../models/product.model.js";

// Create a new product
export const createProduct = async (req, res) => {
    const { productName, desc, price, materials, features, categories, sizes } = req.body;
    const { _id } = req.user;
    const files = req.files;

    try {
        if (!files || !files["previewPix"] || !files["Img2"] || !files["Img3"]) {
            return res.status(400).json({ message: "All image fields are required" });
        }

        //Upload images to Cloudinary using streamifier
        const previewPixResponse = await streamUpload(files["previewPix"][0].buffer, "images");
        const Img2Responses = await streamUpload(files["Img2"][0].buffer, "images");
        const Img3Responses = await streamUpload(files["Img3"][0].buffer, "images");

        //attach append image URL to body
        body.previewPix = previewPixResponse.secure_url;
        body.Img2 = Img2Responses.secure_url;
        body.Img3 = Img3Responses.secure_url;

        // Create new product
        const newProduct = new Product({
            user: _id,
            productName,
            desc,
            price,
            materials,
            features: features ? features.split(',').map(feature => feature.trim()) : [],
            categories,
            sizes: sizes ? sizes.split(',').map(size => size.trim()) : [],
            previewPix: {
                publicId: previewPixResponse.public_id,
                size: previewPixResponse.bytes
            },
            Img2: [{
                publicId: Img2Responses.public_id,
                size: Img2Responses.bytes
            }],
            Img3: [{
                publicId: Img3Responses.public_id,
                size: Img3Responses.bytes
            }]
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);

        await Product.findByIdAndUpdate(
            _id,
            { $push: { products: savedProduct._id } },
            { new: true }
        );

        return res.status(201).json(savedProduct);

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("user", "username email").populate("admin", "username email");
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id)
        .populate("user", "username email")
        .populate("admin", "username email");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    const { _id } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(_id, updates, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    const {_id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(_id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

//========error page========//
export const errorPage = async (req, res, next) => {
    if (!createProduct, !getAllProducts, !getProductById, !updateProduct, !deleteProduct) {
      return res.status(404)({message: "This page does not exist"})
    }
    next();
};