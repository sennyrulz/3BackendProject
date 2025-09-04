import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
// import kycModel from "../models/kyc.model.js";

// 1. Authenticate user
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      admin: user.admin, // if applicable
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// // 2. Check if user has approved KYC
// export const authorizeKYC = async (req, res, next) => {
//   try {
//     const kycData = await kycModel.findOne({ user: req.user.id });

//     if (!kycData) {
//       return res.status(403).json({ message: 'KYC not submitted' });
//     }

//     if (kycData.status !== 'approved') {
//       return res.status(403).json({ message: 'KYC not approved' });
//     }

//     next();
//   } catch (error) {
//     return res.status(500).json({ message: 'Error checking KYC status' });
//   }
// };

// // 3. Allow frontend to check KYC status
// export const checkKYCStatus = async (req, res) => {
//   try {
//     const kycData = await kycModel.findOne({ user: req.user.id });

//     if (!kycData) {
//       return res.status(404).json({ message: 'KYC not found' });
//     }

//     return res.status(200).json({ kycStatus: kycData.status });
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


