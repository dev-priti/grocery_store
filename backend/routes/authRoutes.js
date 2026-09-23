const bcrypt = require("bcryptjs");
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findUserByEmail = async (email) => {
    return User.findOne({
        email: {
            $regex: new RegExp(`^${escapeRegex(email)}$`, "i"),
        },
    });
};

router.post("/register", async (req, resp) => {
    try {
        const firstName = req.body.firstName?.trim();
        const lastName = req.body.lastName?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!firstName || !lastName || !email || !password) {
            return resp.status(400).json({
                message: "First name, last name, email, and password are required",
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

        if (firstName.length < 2 || lastName.length < 2) {
            return resp.status(400).json({
                message: "Name must be at least 2 characters",
            });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return resp.status(400).json({
                message: "An account with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const name = `${firstName} ${lastName}`.trim();
        const newUser = await User.create({
            name,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone: req.body.phone?.trim() || "",
        });

        resp.status(201).json({
            message: "Account created successfully",
            user: {
                id: newUser._id,
                name: newUser.name || name,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        resp.status(500).json({
            message: "Registration failed",
        });
    }
});

router.post("/login", async (req, resp) => {
    try {
        const password = req.body.password;
        const email = req.body.email?.trim().toLowerCase();

        if (!email || !password) {
            return resp.status(400).json({
                message: "Email and password are required",
            });
        }

        if (!email.includes("@")) {
            return resp.status(400).json({
                message: "Please enter a valid email",
            });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return resp.status(401).json({
                message: "Invalid email or password",
            });
        }

        let isPasswordCorrect = false;

        if (user.password && user.password.startsWith("$2")) {
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        } else {
            isPasswordCorrect = password === user.password;

            if (isPasswordCorrect) {
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            }
        }

        if (!isPasswordCorrect) {
            return resp.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const userName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();

        resp.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: userName,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        resp.status(500).json({
            message: "Login failed",
        });
    }
});

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
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                emailOptin: user.emailOptin,
                dob: user.dob,
            },
        });
    } catch (error) {
        resp.status(500).json({
            message: "Failed to get profile",
        });
    }
});

router.put("/profile", authMiddleware, async (req, resp) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            dob,
            emailOptin,
            password,
            confirmPassword,
        } = req.body;

        // Required fields
        if (!firstName || !lastName) {
            return resp.status(400).json({
                message: "Please enter the required fields",
            });
        }

        // Name validation
        if (
            firstName.trim().length < 2 ||
            lastName.trim().length < 2
        ) {
            return resp.status(400).json({
                message:
                    "Name must be at least 2 characters",
            });
        }

        // Phone validation
        if (
            phone &&
            !/^\d{10}$/.test(phone.trim())
        ) {
            return resp.status(400).json({
                message:
                    "Please enter a valid 10-digit mobile number",
            });
        }

        // Password validation only if user entered a new password
        if (password) {
            if (password.length < 8) {
                return resp.status(400).json({
                    message:
                        "Password must be at least 8 characters",
                });
            }

            if (password !== confirmPassword) {
                return resp.status(400).json({
                    message:
                        "Password and confirm password do not match",
                });
            }

            user.password = await bcrypt.hash(password, 10);
        }

        // Find the currently logged-in user
        const user = await User.findById(req.userId);

        if (!user) {
            return resp.status(404).json({
                message: "User not found",
            });
        }

        // Update profile fields
        user.firstName = firstName.trim();
        user.lastName = lastName.trim();
        user.name =
            firstName.trim() +
            " " +
            lastName.trim();

        user.phone = phone
            ? phone.trim()
            : "";

        user.emailOptin = emailOptin ? 1 : 0;

        // Update DOB
        if (dob) {
            user.dob = new Date(dob);
        } else {
            user.dob = undefined;
        }

        // Only update password if user entered one
        if (password) {
            const bcrypt = require("bcrypt");

            user.password = await bcrypt.hash(
                password,
                10
            );
        }

        // Email is deliberately NOT changed
        // user.email remains unchanged

        const updatedUser = await user.save();

        return resp.status(200).json({
            success: true,
            message:
                "User is updated successfully.",
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                dob: updatedUser.dob,
                emailOptin: updatedUser.emailOptin,
            },
        });
    } catch (error) {
        console.error(
            "Update user error:",
            error
        );

        return resp.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
});

module.exports = router;
