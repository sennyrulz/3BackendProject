import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    publicId: String,
    size: Number
    
})

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },

    price: {
        type: String,
        required: true
    },

     materials: { 
      type: String, 
      required: true 
    },

    features: [String],

    category: {
        type: [String],
        enum: ["Clothing", "Accessories", "Footwear", "Electronics", "Home Appliances"],
        required: true
    },

    sizes: {
        String,
        enum: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"]
    },

    previewPix: {
        publicId: String,
        size: Number
    },
    
    Img1: [imageSchema],
    Img2: [imageSchema],

    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    inStock: { type: Boolean, default: true },
    
}, {timestamps: true}
);

const Product = mongoose.model("Product", productSchema)
export default Product;