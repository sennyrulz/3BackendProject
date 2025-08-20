import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import checkoutModel from "../models/checkout.model.js";

export const processCheckout = async (req, res) => {
const {products} = req.body;
    const {_id } = req.user;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "No products provided for checkout" });
    }

    try {
        // Validate products
        const productIds = products.map(product => product.productId);
        const validProducts = await productModel.find({ _id: { $in: productIds } });

        if (validProducts.length !== products.length) {
            return res.status(404).json({ message: "Some products not found" });
        }

        // Calculate subtotal and total
        let subtotal = 0;
        products.forEach(product => {
            const validProduct = validProducts.find(p => p._id.toString() === product.productId);
            if (validProduct) {
                subtotal += validProduct.price * product.quantity;
            }
        });

        const shippingCost = 0; // Set your shipping cost logic here
        const total = subtotal + shippingCost;

        // Create checkout record
        const checkoutData = {
            contact: req.body.contact,
            delivery: req.body.delivery,
            shippingMethod: req.body.shippingMethod,
            shippingCost,
            payment: req.body.payment,
            billingAddress: req.body.billingAddress,
            products,
            subtotal,
            total,
            user: _id
        };

        const checkout = new checkoutModel(checkoutData);
        await checkout.save();

        return res.status(201).json({ 
            success: true,
            message: "Checkout processed successfully", 
            checkout 
        });
    } catch (error) {
        console.error("Checkout processing error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }   

}