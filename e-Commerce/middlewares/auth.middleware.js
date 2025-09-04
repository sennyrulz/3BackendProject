import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Kyc from "../models/kyc.model.js";

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

// 2. Allow frontend to check KYC status
export const checkKYCStatus = async (req, res) => {
  try {
    const kycData = await Kyc.findOne({ user: req.user._id });

    if (!kycData) {
      return res.status(404).json({ message: 'KYC not found' });
    }

    return res.status(200).json({ kycStatus: kycData.status });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


