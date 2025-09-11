import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  posts: [{type: mongoose.Types.ObjectId, ref: "Post"}],
  
  admin: {
    type: Boolean, 
    default: false
  },

},{timestamps: true});

//hash password before saving
userSchema.pre("save", async function (next) {
  const hashedPassword = bcrypt.hashSync(this.password, 10)
  this.password = hashedPassword;
  next();
});

// Compare passwords
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// userSchema.post("save", function (next) {
  // console.log("User saved:", doc);
  // console.log("A verification email has been sent to your email");
  // next();
// });

const User = mongoose.model("User", userSchema);

export default User;