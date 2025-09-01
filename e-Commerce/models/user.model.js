import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    kyc: { type: mongoose.Types.ObjectId, ref: "Kyc" },
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    checkout: { type: mongoose.Types.ObjectId, ref: "Checkout" },
    payment: { type: mongoose.Types.ObjectId, ref: "Payment" },
    cart: { type: mongoose.Types.ObjectId, ref: "Cart" },

    admin: { 
        type: Boolean, 
        default: false 
    },
}, {timestamps: true}
);

//mongoose middleware 
userSchema.pre("save", async function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10)
    this.password = hashedPassword;
    next();
});
userSchema.pre("validate", function(next) {
    console.log("something happened");
    next();
});

userSchema.post("save", function(doc, next) {
    console.log(doc);
    console.log("A verification email has been sent to your email");
    next();
});

const User = mongoose.model("User", userSchema);
export default User