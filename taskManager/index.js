import express from 'express';
import { urlencoded } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();
const app = express();

//Create connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("connection was successful"))
    .catch(() => console.log("something went wrong"));

app.use(express.json());
//processing different data types in backend/postman
app.use(
    express.text({ 
    type: [
        "application/javascript", "text/plain", "text/html", "application/xml"
    ]}
));
app.use(urlencoded)({ extended: true });
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5009", "https://backend-taskManager.onrender.com/"],
  credentials: true
}));



app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5009;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});