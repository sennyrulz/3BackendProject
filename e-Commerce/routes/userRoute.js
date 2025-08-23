import express from "express";
import {authenticateToken, authorizeKYC, checkKYCStatus} from "../middlewares/auth.middleware.js";
import  {createUser, loginUser, getUser, completeKyc} from "../controllers/user.controller.js"

const route = express.Router();

route.post("/signup", createUser);
route.post("/login", loginUser);
route.get("/allUsers", authenticateToken, getUser)

export default route
