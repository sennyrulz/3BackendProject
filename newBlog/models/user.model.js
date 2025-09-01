import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  admin: {
    type: Boolean, 
    default: false
  },
  post: {type: mongoose.Types.ObjectId, ref: "Post"}

},{timestamps: true});

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if new or modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.post("save", function (doc, next) {
  console.log("User saved:", doc);
  console.log("A verification email has been sent to your email");
  next();
});

const User = mongoose.model("User", userSchema);

export default User;