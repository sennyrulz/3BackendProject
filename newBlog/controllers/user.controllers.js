import jwt from "jsonwebtoken";
// import { streamUpload } from "../utils/streamUpload.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// ================= Create User =================
export const createUser = async (req, res) => { 
  const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required"});
    }

    // Check if user already exists in DB
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({ message: "User already in exist!"});
    };

  // Create a new user
  try {
    const newUser = new User({ 
      fullName, 
      email, 
      password 
    });

  //Save user to DB
    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (error) {
    console.log(error.message);
    return res.send("something went wrong");
  }
};

// ================= Login User =================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

//validate user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  };

  //compare password  
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }
    const token = jwt.sign(
      { id: user._id, admin: user.admin },
      process.env.JWT_SECRET, 
      { expiresIn: "7d"});

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    return res.status(200).json({ 
      success: true, 
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,

      }
    });
  };


// ================= Get All Users =================
export const getAllUsers = async (req, res) => {
  try {
    const getAllUsers = await User.find()
    // .select("-password");
    .populate("posts", "title desc, previewPix, img2, img3, img4, timestamps");
    return res.status(200).json({ success: true, users: getAllUsers });
  
  } catch (error) {
    return res.send("error")
  }
};

// ================= Get Current User =================
export const getUser = async (req, res) => {
  const { _id } = req.user;
  const user = await userModel
    .findById(_id)
    .populate("kyc")
    .populate("post")
    return res.json(user);
  };

// ================= Update User =================
export const updateUser = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    // only self-update or admin
    if (req.user._id !== req.params.id && !req.user.admin) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (error) {
      return res.send("something went wrong");
  }
};

// ================= Delete User =================
export const deleteUser = async (req, res) => {
  try {
    // only self-delete or admin
    if (req.user._id !== req.params.id && !req.user.admin) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.send("something went wrong");
  }
};

// ================== ARRAY UPLOAD ==================
export const arrayUpload = async (req, res, next) => {
  try {
    const uploads = await Promise.all(
      req.files.map((file) => streamUpload(file.buffer, "images"))
    );
    return res.json({ message: "Upload successful", uploads });
  } catch (error) {
    next(error);
  }
};

// ================== ERROR HANDLER (404) ==================

export const errorPage = async (req, res, next) => {
    if (!createUser, !getUser, !updateUser, !deleteUser, !loginUser) {
      return res.status(404)({message: "This page does not exist"})
    }
    next();
};