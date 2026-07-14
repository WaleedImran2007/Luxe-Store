import express from 'express';
import Order from '../models/Order.js';
import Item from '../models/Item.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// GET: LOGGED IN USER ORDER
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userID,
        })
            .populate('items.product')
            .sort({ createdAt: -1 });

        res.json(orders);
    }

    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

// POST: SAVE ORDER OF LOGGED IN USER
router.post('/', async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        let orderItems = [];
        let totalPrice = 0;

        for (const item of items) {
            const product = await Item.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `${product.name} is out of stock.`,
                });
            }

            product.stock -= item.quantity;
            await product.save();

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.discountedPrice,
            });



            totalPrice += product.discountedPrice * item.quantity;
        }

        const order = new Order({
            user: req.user.userID,
            items: orderItems,
            shippingAddress,
            totalPrice,
            paymentMethod
        });

        await Cart.findOneAndUpdate(
            { user: req.user.userID },
            { items: [] }
        );

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
        });

    }

    catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message,
        });
    }
});


export default router;