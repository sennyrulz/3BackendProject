import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

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
    
    image: { type: String } // thumbnail or Cloudinary publicId
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
  },

  { timestamps: true }
);



//==========================================
// Auto-update subtotal when saving
cartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
