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

    sizes: {
        String,
        enum: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"]
    },

    Img1: [imageSchema],
    Img2: [imageSchema],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

});

const productModel = mongoose.model("Product", productSchema)
export default productModel;