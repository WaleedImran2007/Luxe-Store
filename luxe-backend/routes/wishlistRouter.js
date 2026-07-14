import express from 'express';
import Wishlist from '../models/Wishlist.js';

const router = express.Router();

// POST: ADD ITEM
router.post('/', async (req, res) => {
    console.log("WISHLIST ROUTE HIT");
    try {
        const { itemID } = req.body;
        console.log("Backend POST:", itemID);

        let wishlist = await Wishlist.findOne({
            user: req.user.userID
        });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user.userID,
                items: []
            })
        }

        const existingItem = wishlist.items.find(
            item => item.product.toString() === itemID
        )

        if (existingItem) {
            return res.status(400).json({
                message: "Product already in wishlist."
            });
        }

        wishlist.items.push({
            product: itemID
        });

        await wishlist.save();

        res.status(200).json({
            message: "Item added to wishlist",
            wishlist
        });
    }

    catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// GET: ALL ITEMS
router.get('/', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user.userID
        }).populate('items.product');

        if (!wishlist) {
            return res.json({
                items: []
            })
        }

        res.json(wishlist);

    }

    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

// DELETE THE WHOLE WISHLIST
router.delete('/clear', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user.userID
        });

        if (!wishlist) {
            return res.status(404).json({
                message: 'WishList Not Found'
            })
        }

        wishlist.items = [];

        await wishlist.save();

        res.json({
            message: "Wishlist cleared"
        });
    }

    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

// DELETE: DELETING A PRODUCT FROM WISHLIST NOT THE ENTIRE CART
router.delete('/:id', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user.userID
        });

        if (!wishlist) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        wishlist.items = wishlist.items.filter(
            item => item.product.toString() !== req.params.id
        )

        await wishlist.save();

        res.json({
            message: "Item removed",
        });

    }

    catch (err) {
        console.error("Error updating cart quantity:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});

export default router;