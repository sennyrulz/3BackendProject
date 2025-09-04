import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { streamUpload } from "../utils/streamUpload.js"

// create a admin
export const createAdmin = async (req, res ) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({message: "invalid credentials"})
    
    //Create a new Admin
    try {
        const isAdmin = await Admin.findOne({email});
        if(isAdmin) {
            return res.status(400).json({message:"Admin already exist. Please log in"})
        };

            const newAdmin = new Admin({
                fullName,
                email,
                password,
                admin: true
            });

        // Save the admin to the database
            const savedAdmin = await newAdmin.save();
            res.status(201).json(savedAdmin);
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({message:"something went wrong"});
        }
    }
};

//login admin
export const loginAdmin = async (req, res ) => {
    const {email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if(!admin) {
        return res.status(404).json({ error: "This account does not exist, create an account!"});
    };

    //compare password
    const isValid = bcrypt.compareSync(password, admin.password);
    if(!isValid) {
        return res.status(401).json({error: "Invalid password"});
        };

    //create a token
    const token = jwt.sign(
        { id:user._id, admin: true },
        process.env.JWT_SECRET,
        { expiresIn:"1h" }
    );

    res.cookie ("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    return res.status(200).json({ message: "Login successful", token});
    };

export const updateAdmin = async (req, res) => {
    const { _id, ...others } = req.body;
    try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
        _id,
        { ...others },
        { new: true }
        );
        return res.json(updatedAdmin);
    } catch (error) {
        return res.json({message: "error updating admin"});
    }
};

export const deleteAdmin = async (req, res) => {
    const { _id } = req.query;
    try {
        const deletedAdmin = await Admin.findByIdAndDelete
        (_id);
        return res.json(deletedAdmin);
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Cannot delete Admin" });
    } 
};

//upload an array of files
export const arrayUpload = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
        }

        const uploads = await Promise.all(
            req.files.map((file) => streamUpload(file.buffer, "images"))
        );

        req.uploads = uploads;
        next()
    } catch (error) {
        next(error)
    }
}

//========error Page========//
export const errorPage = async (req, res, next) => {
    if (!createAdmin, !updateAdmin, !deleteAdmin, !loginAdmin, !arrayUpload) {
      return res.status(404)({message: "This page does not exist"})
    }
    next();
};