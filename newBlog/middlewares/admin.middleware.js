import jwt from 'jsonwebtoken';
import adminModel from '../models/admin.model.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await adminModel.findById(decoded.id || decoded._id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized: Admin not found" });
    }

    req.admin = admin; // Attach full user document (excluding password)
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};