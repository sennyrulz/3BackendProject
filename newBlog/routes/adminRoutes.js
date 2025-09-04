import express from "express"
import { authenticateToken } from "../middlewares/auth.middlewares.js";
import {
    createAdmin, adminLogin, 
    getAdmin, updateAdmin,
    deleteAdmin, errorPage
    } from "../controllers/admin.controllers.js"

const route = express.Router();

//Authentication
route.post("/signup", createAdmin);
route.post("/login", adminLogin);

//User
route.get("/getAdmin", authenticateToken, getAdmin)
route.put("/:id", authenticateToken, updateAdmin);
route.delete("/:id", authenticateToken, deleteAdmin)

//Error
route.get("/404", errorPage)

export default route