import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export const createAdmin = async (req, res) => {
    const {fullName, email, password} = req.body

    if(!email, !password) {
        return res.json({message: "invalid credentials"})
    }
        const isAdmin = await Admin.findOne({email});
        if(isAdmin) {
            return res.status(400).json({message: "Admin already exist, please sign n"})
        }

        //Create a new admin
        try {
            const newAdmin = new Admin({
                fullName,
                email,
                password
            })

            //Save user to the database
            const savedAdmin = await newAdmin.save();
            const {password, ...adminData} = savedAdmin._doc;
            res.status(201).json(adminData);
        } catch (error) {
            console.error("Error creating admin:", error);
            return res.status(500).json({message:"something went wrong"});
        }
}

export const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body
        const admin = await Admin.findOne({email});

        if(!admin) {
            return res.status(400).json({error: "Invalid credentials"})
        }
    //compare password
    const isMatch = bcrypt.compare(password, admin.password);
    if(!isMatch) {
        return res.status(401).json({error: "Invalid password"});
    };

    //create a token
    const token = jwt.sign(
        { id:admin._id},
        process.env.JWT_SECRET,
        { expiresIn:"1d" } //1day
    );

    res.cookie ("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 *1000 // 1day
    });

    return res.status(200).json({ 
        message: "Login successful",
        admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
        }
    });
        } catch (err) {
            console.error("Login Error:", err.message);
            res.status(500).json({ message: "Server error" });
        }
    };
    

//get all admin
export const getAllAdmin = async (req, res) => {
    try {
        const allAdmin = await Admin
        .find().select("-password")
        .populate("kyc")
        .populate("checkout")
        .populate("payment")
        .populate("cart")

        return res.json(allAdmin)

    } catch (error) {
        return res.json({message: "error getting admin"});
    }
};

//get one admin
export const getAdmin = async (req, res) => {
    const {_id} = req.admin;

        const admin = await Admin
        .findById(_id)
        .populate("kyc")
        .populate("checkout")
        .populate("payment")
        .populate("cart")
        return res.json(admin);
};

export const updateAdmin = async (req, res) => {
    const { _id, ...others } = req.body;
    try {
    const updateAdmin = await Admin.findByIdAndUpdate(
        _id,
        { ...others },
        { new: true }
        );
        return res.json(updateAdmin);
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

export const errorPage = async (req, res, next) => {
    if (!login, !signup) {
        return res.status(404)({message: "This page does not exist"})
    }
    if(!admin) {
        return res.status(404).json({ error: "This account does not exist, create an account!"});
    };
}
 