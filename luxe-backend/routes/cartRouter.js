import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { itemID, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user.userID });

        if (!cart) {
            cart = new Cart({
                user: req.user.userID,
                items: []
            })
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === itemID
        )

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({
                product: itemID,
                quantity: quantity || 1
            })
        }

        await cart.save();

        res.status(200).json({
            message: "Item added to cart",
            cart
        });

    }

    catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }

});

router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userID }).populate('items.product');

        if (!cart) {
            return res.json({
                items: []
            });
        }

        res.json(cart);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });

    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { quantity } = req.body;

        const cart = await Cart.findOne({
            user: req.user.userID
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items.forEach(item => {
            if (item.product.toString() === req.params.id) {
                item.quantity = quantity;
            }
        });

        await cart.save();

        res.json({
            message: "Quantity updated",
            cart
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

// DELETE THE WHOLE CART
router.delete("/clear", async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.userID
        });

        if (!cart)
            return res.status(404).json({
                message: "Cart not found"
            });

        cart.items = [];

        await cart.save();

        res.json({
            message: "Cart cleared"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }

});

// DELETE: DELETING A PRODUCT FROM CART NOT THE ENTIRE CART
router.delete('/:id', async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.userID
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.id
        )

        await cart.save();

        res.json({
            message: "Item removed",
            cart
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