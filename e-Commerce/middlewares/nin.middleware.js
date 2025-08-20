// Do NOT import fakeVerifyNIN here
// import fakeVerifyNIN from '../services/ninVerificationService.js';

export const verifyNINMiddleware = async (req, res, next) => {
  const { documentType, idNumber } = req.body;

  if (documentType !== 'nin') {
    return next(); // Skip if it's not a NIN document
  }

  const ninRegex = /^\d{11}$/;
  if (!ninRegex.test(idNumber)) {
    return res.status(400).json({ message: 'Invalid NIN format' });
  }

  const ninIsValid = await fakeVerifyNIN(idNumber);

  req.body.status = ninIsValid ? 'approved' : 'rejected';

  return next();
};

// Just define it here (remove the import)
const fakeVerifyNIN = async (nin) => {
  return nin.startsWith('1');
};
