import express from 'express';
import Item from '../models/Item.js';

import { upload } from '../middlewares/upload.js';

const router = express.Router();

// GET ITEM BY ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate("category");

        if (!item) {
            return res.status(404).json({ message: 'Item Not Found' });
        }

        res.json(item);
    }

    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET ALL ITEMS
router.get('/', async (req, res) => {
    try {
        const category = req.query.category;
        const priceRange = req.query.priceRange;
        const sortBy = req.query.sortBy;

        const filter = {};
        const sort = {};

        if (category) {
            filter.category = category;
        }

        if (priceRange) {
            if (priceRange === 'under1000') {
                filter.discountedPrice = { $lt: 1000 };
            }

            else if (priceRange === '1000-2500') {
                filter.discountedPrice = {
                    $gte: 1000,
                    $lte: 2500,
                }
            }

            else if (priceRange === '2500-4000') {
                filter.discountedPrice = {
                    $gte: 2500,
                    $lte: 4000,
                }
            }

            else if (priceRange === 'above4000') {
                filter.discountedPrice = {
                    $gt: 4000,
                }
            }
        }

        if(sortBy) {
            if(sortBy === 'priceLow') {
                sort.discountedPrice = 1;
            }

            else if (sortBy === 'priceHigh') {
                sort.discountedPrice = -1;
            }

            else if (sortBy === 'nameAZ') {
                sort.name = 1;
            }

            else if (sortBy === 'nameZA') {
                sort.name = -1;
            }

            else if (sortBy === 'bigDiscount') {
                sort.discountPercentage = -1;
            }

            else {
                sort.createdAt = -1;
            }
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        const totalItems = await Item.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        const items = await Item.find(filter)
            .populate('category')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.json({
            items,
            totalPages,
            currentPage: page,
            totalItems,
        });
    }

    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;