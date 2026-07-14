import express from 'express';
import User from '../models/User.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// POST: ADD A NEW USER
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let role = 'User';

        if (email.trim().toLowerCase() === 'imrankhalida2009@gmail.com') {
            role = 'Admin';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            role
        });

        await user.save();

        await sendEmail(email, verificationToken);

        return res.status(201).json({
            message: "Account created successfully"
        });
    }

    catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];

            return res.status(409).json({
                message: `This ${duplicateField} is already registered.`,
                field: duplicateField
            });
        }

        else {
            console.log("SIGNUP ERROR:", err);
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
});

// POST: GENERATE TOKEN OR LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Verify Your Email First' });
        }

        const token = jwt.sign(
            {
                userID: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },

            process.env.JWT_SECRET,

            { expiresIn: '5d' }
        )

        res.status(200).json({
            message: "Login successful",
            token
        });

    }

    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// TO VERIFY EMAIL
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = null;

        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    }

    catch (err) {
        console.log("EMAIL VERIFICATION ERROR:", err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});


export default router;