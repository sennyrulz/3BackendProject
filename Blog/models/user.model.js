import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
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
    admin: {
        type: Boolean,
        default: false
    }
},{timeStamps: true}
);

//mongoose middleware
userSchema.pre("save", async function (next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10)
    this.password = hashedPassword
    next();
});
userSchema.pre("validate", function(next) {
    console.log("something happen");
    next();
});
userSchema.post("save", function(doc, next) {
    console.log(doc);
    console.log("A verification email has been sent to your email")
});

const userModel = mongoose.model("User", userSchema);
export default userModel