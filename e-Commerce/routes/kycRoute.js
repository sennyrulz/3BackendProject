import express from "express";
import { authenticateToken} from "../middlewares/auth.middleware.js";
import { completeKyc} from "../controllers/user.controller.js"
import { verifyNINMiddleware } from "../middlewares/nin.middleware.js";

const route = express.Router();

// Apply NIN verification middleware before KYC completion
// const kycMiddleware = [authenticateToken, verifyNINMiddleware, authorizeKYC];

route.post( "/", 
  authenticateToken, 
  verifyNINMiddleware, 
  completeKyc
);

export default route;

