import productModel from '../models/product.model.js';
import cartModel from '../models/cart.model.js'

export const addToCart = async (req, res) => {
  try {
    const { productName, desc, price, materials, features, categories, sizes } = req.body;
    const { _id } = req.user;

    // Validation
    if (!productName || !desc || !price || !materials || !features || !categories || !sizes) {
      return res.status(400).json({ message: "All product fields are required" });
    }

    // Find the product that was already created (with images)
    const product = await productModel.findById(_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartItem = new cartModel({
      user: _id,
      product: _id,
      thumbail: product.previewPix.publicId,
      productName: product.productName,
      desc: product.desc,
      price: product.price,
      materials: product.materials,
      features: product.features,
      categories: product.categories,
      sizes: product.sizes,
    });

    const savedCart = await cartItem.save();
    return res.status(201).json(savedCart);

  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(400).json({ message: "Error adding to cart" });
  }
};


// Get user cart with product details
export const getCart = async (req, res) => {
  try {
     const {_id} = req.user; // auth middleware sets req.user

    const cart = await cartModel.findOne({user: _id })
      .populate({
        path: "items.productId",
        select: "productName Img1 price", 
        // Img1 = your previewPix thumbnail
      });

    if (!cart) {
      return res.status(200).json({ items: [], subtotal: 0 });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
    });
  }
};


export default addToCart;
