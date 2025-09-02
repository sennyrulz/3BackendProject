import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    const hashedPassword = bcrypt.hashSync(this.password, 10)
    this.password = hashedPassword;
    next();
});

const User = mongoose.model('User', userSchema);

export default User;