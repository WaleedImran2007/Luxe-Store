import express from 'express';
import Review from '../models/Review.js';

import updateProdRating from '../utils/updateProdRating.js';

const router = express.Router();

// GET: GET BY ID
router.get('/:productID', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productID })
            .populate('user')
            .sort({ createdAt: -1 });

        res.json(reviews);
    }

    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST: ADD NEW REVIEW
router.post("/:productId", async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const existing = await Review.findOne({
            user: req.user.userID,
            product: req.params.productId,
        });

        if (existing) {

            existing.rating = rating;
            existing.comment = comment;

            await existing.save();

        } else {

            await Review.create({
                user: req.user.userID,
                product: req.params.productId,
                rating,
                comment,
            });

        }

        await updateProdRating(req.params.productId);

        res.json({
            message: "Review saved."
        });
    }

    catch (err) {
        res.status(400).json({ message: err.message });
    }

});


// DELETE: DELETE REVIEW
router.delete("/:productId", async (req, res) => {
    try {
        await Review.findOneAndDelete({
            user: req.user.userID,
            product: req.params.productId,
        });

        await updateProdRating(req.params.productId);

        res.json({
            message: "Review deleted."
        });
    }

    catch (err) {
        res.status(500).json({ message: err.message });
    }

});

export default router;