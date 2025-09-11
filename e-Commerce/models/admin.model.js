import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    fullName: {
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
    products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    admin: { 
        type: Boolean, 
        default: true
    },   
},
 {timestamps: true}
);

//mongoose middleware 
adminSchema.pre("save", async function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10)
    this.password = hashedPassword;
    next();
});
adminSchema.pre("validate", function(next) {
    console.log("something happened");
    next();
});

adminSchema.post("save", function (doc, next) {
    console.log(doc);
    console.log("A verification email has been sent to your email");
    next();
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin