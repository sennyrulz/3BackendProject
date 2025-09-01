import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
// import kycModel from "../models/kyc.model.js";

// 1. Authenticate user
export const authenticateToken = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

   if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    const user = await userModel.findById(decoded.id || decoded._id).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
    
  } catch (err) {
    console.error("JWT Auth Error:", err.message);
    return res.status(403).json({ message: "Session expired. Please log in again" });
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


