import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ================= Create User =================
export const createUser = async (req, res) => {
 
  const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already in use" });
    }
  try {
    const newUser = new User({ fullName, email, password });
    const savedUser = await newUser.save();

    return res.status(savedUser);

  } catch (error) {
    console.log(error.message);
    return res.send("something went wrong");
  }
};

// ================= Login User =================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });

  };

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, admin: user.admin },
      process.env.JWT_SECRET, 
      { expiresIn: "7d"});

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ success: true, message: "Login successful"});
  };


// ================= Get All Users =================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
        return res.send("something went wrong");
  }
};

// ================= Get Current User =================
export const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.send("something went wrong");
  }
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


// ================== ERROR HANDLER (404) ==================
export const errorPage = (req, res) => {
  return res.status(404).json({ error: "This page does not exist" });
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
