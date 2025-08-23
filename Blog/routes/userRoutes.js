import express from 'express'
import { createUser, loginUser, getUser} from '../../e-Commerce/controllers/user.controller.js';

const route = express.Router();

route.post("/signup", createUser);
route.post("/login", loginUser);
route.get("/allUsers", authenticateToken, getUser)

export default route