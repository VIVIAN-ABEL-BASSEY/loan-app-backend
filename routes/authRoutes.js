const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
// User Signup Route with Validation
router.post(
    "/signup",
    [
        body("Surname").notEmpty().withMessage("Surname is required"),
        body("Firstname").notEmpty().withMessage("Firstname is required"),
        body("Middlename").notEmpty().withMessage("Middlename is required"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("Phonenumber").isLength({ min: 11 }).withMessage("Phonenumber is required"),
        body("Location").notEmpty().withMessage("Location is required"),
        body("nin").notEmpty().withMessage("NIN is required")

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const {Surname, Firstname, Middlename, email, password,Phonenumber, Location, nin } = req.body;
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ message: "User already exists" });
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({ Surname, Firstname, Middlename, email, password: hashedPassword,Phonenumber, Location, nin });
            await user.save();
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            // i just added an user,_id in the return data
            res.status(201).json({ message: "User registered successfully", token, "user id":user._id });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
