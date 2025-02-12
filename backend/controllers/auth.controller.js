// auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// Register a new user
export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    // Automatically assign admin rights to specific email
    const isAdmin = email === "admin@gmail.com";

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user with isAdmin attribute
        const newUser = new User({ email, password: hashedPassword, isAdmin });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id, // Ensure _id is included
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            }
        });
    } catch (error) {
        console.error("Error in register:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Login a user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
            }
        });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
