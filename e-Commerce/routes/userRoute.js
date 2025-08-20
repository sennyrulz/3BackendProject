import express from "express";
import {authenticateToken, authorizeKYC, checkKYCStatus} from "../middlewares/auth.middleware.js";
import  {createUser, loginUser, getUser, completeKyc} from "../controllers/user.controller.js"

const route = express.Router();

route.post("/auth", createUser);
route.post("/login", authenticateToken, authorizeKYC, loginUser);
route.get("/allUsers", authenticateToken, getUser)

export default route
