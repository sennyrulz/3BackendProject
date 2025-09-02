import express from 'express';
import {createUser, loginUser, logoutUser} from '../controllers/user.controllers.js';


const route = express.Router();

route.post('/register', createUser);
route.post('/login', loginUser);
route.post('/logout', logoutUser);

export default route;   