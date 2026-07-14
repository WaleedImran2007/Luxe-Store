import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

import { upload } from '../middlewares/upload.js';
import { deleteUploadedFile } from '../utils/deleteUploadedFile.js';

const router = express.Router();

router.get('/profile', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userID }).select('-password');

        res.json(user);
    }

    catch (err) {
        console.log("SERVER ERROR:", err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/profile', upload('pfp').single('profileImage'), async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userID })

        user.username = req.body.username || user.username;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.postalCode = req.body.postalCode || user.postalCode;
        user.country = req.body.country || user.country;

        if (req.file) {
            // Remove the old profile picture from disk so it doesn't pile up
            const oldImage = user.profileImage;
            user.profileImage = req.file.filename;

            if (oldImage) {
                deleteUploadedFile('pfp', oldImage);
            }
        }

        await user.save();

        res.json({
            message: 'Successfully Updated Profile',
            user
        });
    }

    catch (err) {
        console.log("SERVER ERROR:", err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'All password fields are required'
            });
        }

        const user = await User.findOne({ _id: req.user.userID });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'New passwords do not match'
            });
        }

        const samePassword = await bcrypt.compare(newPassword, user.password);

        if (samePassword) {
            return res.status(400).json({
                message: 'New password must be different from the current password'
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.json({
            message: 'Password updated successfully'
        });

    }

    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

export default router;