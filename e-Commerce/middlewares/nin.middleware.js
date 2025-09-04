// import fakeVerifyNIN from '../services/ninVerificationService.js';

// Middleware to verify NIN before KYC submission
export const verifyNINMiddleware = async (req, res, next) => {
  try {
    const { documentType, idNumber } = req.body;

    // Skip if it's not a NIN document
    if (documentType !== "nin") {
      return next();
    }

    // Check format (11 digits only)
    const ninRegex = /^\d{11}$/;
    if (!ninRegex.test(idNumber)) {
      return res.status(400).json({ message: "Invalid NIN format. Must be 11 digits." });
    }

    // Fake verification service
    const ninIsValid = await fakeVerifyNIN(idNumber);

    // Automatically set status    
    req.body.status = ninIsValid ? "approved" : "rejected";

    return next();
  } catch (error) {
    console.error("NIN Middleware Error:", error);
    return res.status(500).json({ message: "Error verifying NIN" });
  }
};

// Mock NIN verification service (replace with real API later)
const fakeVerifyNIN = async (nin) => {
  // Example rule: approve if it starts with "959" (for testing)
  return nin.startsWith("959");
};

