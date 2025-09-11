import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Kyc from '../models/kyc.model.js';
import bcrypt from 'bcryptjs';

// create a user
export const createUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.json({message: "invalid credentials"})
    }
    const isUser = await User.findOne({email});
    if(isUser) {
        return res.status(400).json({message:"User already exist. Please log in"})
    };

    //Create a new user
    try {
        const newUser = new User({
            fullName,
            email,
            password,
        });

// Save the user to the database
    const savedUser = await newUser.save();
        return res.json(savedUser);
        } catch (error) {
            console.log(error.message);
        return res.send("something went wrong");
        }
};

//login a user
export const loginUser = async (req, res ) => {
    const {email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({ error: "This account does not exist, create an account!"});
    };
    
    //compare password
    const isMatch = bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(401).json({error: "Invalid password"});
        };

    //create a token
    const token = jwt.sign(
        { id: user._id},
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
        success: true,
        message: "Login successful",
        user: {
            id: user._id,
            name: user.fullName,
            email: user.email
        }
    });
};

//get all users
export const getAllUsers = async (req, res) => {
   try {
     const allUsers = await User
    .find().select("-password")
    .populate("kyc")
    .populate("checkout")
    .populate("payment")
    .populate("cart")

    return res.json(allUsers)

   } catch (error) {
        return res.json({message: "error getting users"});
   }
};

//get one user
export const getUser = async (req, res) => {
    const {_id} = req.user;

    const user = await User
    .findById(_id)
    .populate("kyc")
    .populate("checkout")
    .populate("payment")
    .populate("cart")

    return res.json(User);
};

//complete KYC
export const completeKyc = async (req, res) => {
    try {
        const {_id} = req.user;
        const { phone, documentType, idNumber, status, ...others } = req.body
        
        // Check if KYC already exists for user
        const existingKyc = await Kyc.findOne({ user: _id });

    if (existingKyc) {
      return res.status(400).json({ 
        message: "KYC already completed, Please Login" });
    }

    // Create new KYC
    const newKyc = new Kyc({
        user: _id,
        phone, 
        documentType, 
        idNumber, 
        status: status || 'pending', // Default to 'pending' if not provided
        ...others,
    });

    const savedKyc = await newKyc.save();

    // Link KYC back to User
    await User.findByIdAndUpdate(_id, { kyc: savedKyc._id });

    return res.status(201).json({ 
        message: "KYC completed successfully", 
        kyc: savedKyc });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateUser = async (req, res) => {
    const { _id, ...others } = req.body;
    try {
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        { ...others },
        { new: true }
        );
        return res.json(updatedUser);
    } catch (error) {
        return res.json({message: "error updating user"});
    }
};

export const deleteUser = async (req, res) => {
    const { _id } = req.query;
    try {
        const deletedUser = await User.findByIdAndDelete
        (_id);
        return res.json(deletedUser);
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Cannot delete User" });
    } 
};

export const errorPage = async (req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "The requested resource does not exist",
  });
};

