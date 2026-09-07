const bcrypt = require("bcryptjs");
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, resp) => {
    try {
        const {name, password} = req.body;
        const email = req.body.email?.trim().toLowerCase();
        if (!name || !email || !password) {
            return resp.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        if (!email.includes("@")) {
            return resp.status(400).json({
                message: "Please enter a valid email",
            });
        }

        if (password.length < 6) {
            return resp.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        if (name.trim().length < 2) {
            return resp.status(400).json({
                message: "Name must be at least 2 characters",
            });
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return resp.status(400).json({
                message: "An account with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        resp.status(201).json({
            message: "Account created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },            
        });
    } catch(error) {
        resp.status(500).json({
            message: "Regsitration failed",
        })
    }
})

router.post("/login", async (req, resp) => {
    try {
        const {password} = req.body;
        const email = req.body.email?.trim().toLowerCase();

        if ( !email || !password) {
            return resp.status(400).json({
                message: "Email and password are required",
            });
        }

        if (!email || !email.includes("@")) {
            return resp.status(400).json({
                message: "Please enter a valid email",
            });
        }
        const user = await User.findOne({email});

        if(!user) {
            return resp.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        )

        if(!isPasswordCorrect) {
            return resp.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        resp.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch(error) {
        resp.status(500).json({
            message: "Login failed!!!"
        });
    }
})

router.get("/profile", authMiddleware, async (req, resp) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return resp.status(404).json({
                message: "User not found",
            });
        }

        resp.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        resp.status(500).json({
            message: "Failed to get profile",
        });
    }
});

module.exports = router;
