import express from "express";
import {authenticateToken} from "../middlewares/auth.middleware.js";
import  {
    createUser, 
    loginUser, 
    getUser, 
    updateUser, 
    deleteUser, 
    errorPage
} from "../controllers/user.controller.js"

const route = express.Router();

//Auth
route.post("/signup", createUser);
route.post("/login", loginUser);

//User
route.get("/allUsers", authenticateToken, getUser)
route.put("/:id", authenticateToken, updateUser);
route.delete("/:id", authenticateToken, deleteUser)

//Protected Route
route.get('/:id/dashboard', authenticateToken, (req, res) => {
res.status(200).json({ message: 'Welcome to the User Dashboard' })});

//Error
route.get("/404", errorPage);

export default route
