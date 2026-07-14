import express from 'express';
import Category from '../models/Category.js';

import { upload } from '../middlewares/upload.js';

const router = express.Router();

// REST APIs

// GET: ALL CATEGORIES
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET: CATEGORY BY ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });

        if (!category) return res.status(404).json({ message: 'Category Not Found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


export default router;