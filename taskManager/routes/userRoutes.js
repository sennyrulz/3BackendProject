import express from 'express';
import {createUser, loginUser, logoutUser} from '../controllers/user.controllers.js';


const route = express.Router();

route.post('/register', createUser);
route.post('/login', loginUser);
route.post('/logout', logoutUser);

//Get tasks for a specific user
route.get('/:userId/tasks', getUserTasks);
route.post('/:userId/tasks', createTaskForUser);
route.delete('/:userId/tasks/:taskId', deleteTaskForUser);
route.put('/:userId/tasks/:taskId', updateTaskForUser);

export default route;   