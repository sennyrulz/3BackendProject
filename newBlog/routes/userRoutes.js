import express from 'express'
import {authenticateToken} from "../middlewares/auth.middlewares.js";
import { 
    createUser, 
    loginUser, 
    getUser, 
    updateUser, 
    deleteUser, 
    errorPage
} from '../../e-Commerce/controllers/user.controller.js';

const route = express.Router();

//Auth
route.post("/signup", createUser);
route.post("/login", loginUser);

//Users
route.get("/allUsers", authenticateToken, getUser)
route.put("/:id", authenticateToken, updateUser);
route.delete("/:id", authenticateToken, deleteUser)

//Error
route.get("/404", errorPage)

export default route