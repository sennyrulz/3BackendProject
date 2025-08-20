import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import kycModel from '../models/kyc.model.js';

// create a user
export const createUser = async (req, res ) => {
    const { email, password, ...others } = req.body;

    if (!email || !password) {
        return res.json({message: "invalid credentials"})
    }
        const isUser = await userModel.findOne({email});
        if(isUser) {
            return res.status(400).json({message:"User already exist. Please log in"})
        };

        //Create a new user
        try {
            const newUser = new userModel({
                email,
                password,
                ...others,
            });

            // Save the user to the database
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({message:"something went wrong"});
        }
};


//login a user
export const loginUser = async (req, res ) => {
    const {email, password } = req.body;

    const user = await userModel.findOne({ email });
    if(!user) {
        return res.status(404).json({ error: "This account does not exist, create an account!"});
    };
    //compare password
    const isValid = bcrypt.compareSync(password, user.password);
    if(!isValid) {
        return res.status(401).json({error: "Invalid password"});
        };

    //create a token
    const token = jwt.sign(
        { id:user._id, admin:user.admin },
        process.env.JWT_SECRET,
        { expiresIn:"1h" }
    );

    res.cookie ("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    return res.status(200).json({ message: "Login successful"});
    };

//get all users
export const getAllUsers = async (req, res) => {
   try {
     const allUsers = await userModel
    .find()
    .populate("Kyc")
    .populate("Checkout")
    .populate("Payment")
    .populate("Order")
    .populate("Cart")
   } catch (error) {
        return res.json({message: "error getting users"});
   }
};

//get one user
export const getUser = async (req, res) => {
    const {_id} = req.user;

    const User = await userModel
    .findById(_id)
    .populate("Kyc")
    .populate("Checkout")
    .populate("Payment")
    .populate("Order")
    .populate("Cart")

    return res.json(User);
};

//complete KYC
export const completeKyc = async (req, res) => {
    const {_id} = req.user;

    const { phone, documentType, idNumber, status, ...others } = req.body
    
    // Check if KYC already exists for user
    try {
    const existingKyc = await kycModel.findOne({ user: _id });
    
    if (existingKyc) {
      return res.status(400).json({ message: "KYC already completed, Please Login" });
    }

    // Create new KYC
    const newKyc = new kycModel({
        phone, 
        documentType, 
        idNumber, 
        status: status || 'pending', // Default to 'pending' if not provided
        ...others,
        user: _id,
    });

    const savedKyc = await newKyc.save();

    // Optionally update user with kyc reference
    await userModel.findByIdAndUpdate(_id, { kyc: savedKyc._id });

    return res.status(201).json({ message: "KYC completed successfully", kyc: savedKyc });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUser = async (req, res) => {
    const { _id, ...others } = req.body;
    try {
    const updatedUser = await userModel.findByIdAndUpdate(
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
        const deletedUser = await userModel.findByIdAndDelete
        (_id);
        return res.json(deletedUser);
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ error: "Cannot delete User" });
    } 
};
