import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// 1. Authenticate user
export const authenticateToken = async (req, res, next) => {
   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user info to request object
    req.user = {
      _id: user._id,
      email: user.email,
      admin: user.admin || false,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};