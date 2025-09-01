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

    categrory: {
        type: String,
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
    
    Img2: [imageSchema],
    Img3: [imageSchema],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, {timestamps: true}
);

const Product = mongoose.model("Product", productSchema)
export default Product;