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
    
    kyc: { type: mongoose.Types.ObjectId, ref: "kyc" },
    product: { type: mongoose.Types.ObjectId, ref: "product" },
    checkout: { type: mongoose.Types.ObjectId, ref: "checkout" },
    payment: { type: mongoose.Types.ObjectId, ref: "payment" },
    cart: { type: mongoose.Types.ObjectId, ref: "cart" },

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

const userModel = mongoose.model("User", userSchema);
export default userModel