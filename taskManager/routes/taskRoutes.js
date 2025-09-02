import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';

const route = express.Router();

route.post('/create', createTask);
route.get('/', authenticateUser, getTasks);
route.put('/:id', updateTask);
route.delete('/:id', deleteTask);

export default route;  