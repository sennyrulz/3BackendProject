import express, { Router } from 'express';
import { errorPage } from '../controllers/user.controllers'
import { authenticateToken } from '../middlewares/auth.middlewares';

const route = express.Router()

//Error
route.get("/404", authenticateToken ,errorPage)

export default route