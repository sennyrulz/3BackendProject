import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

export const createUser = async (req, res) => {
    const {username, email, password} = req.body;
    
    if (!username || !email || !password) {
        return res.send("All fields are required");
    };

    const isUser = await User.findOne({email});
    if(isUser) {
        return res.status(400).json({message: "User already exists"});
    };
    try {
        const newUser = new User({
            username, 
            email, 
            password
    });
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        console.log(error.message);
        return res.send("something went wrong");
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "All fields are required"});
    };
    
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message: "User not found"});
        };  
       
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials"});
        };

        //create a token
        const token = jwt.sign({ 
        id: user._id, admin: user.admin 
        }, process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    res.cookie ("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 1000 * 60 * 60 // 1 hour   
    });

    return res.status(200).json({message: "Login successful", token});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: "Something went wrong"});
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    return res.status(200).json({message: "Logout successful"});
};