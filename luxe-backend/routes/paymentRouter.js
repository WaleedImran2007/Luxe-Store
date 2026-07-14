import express from 'express';
import stripe from '../config/stripe.js';
import Item from '../models/Item.js';

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        // Get products from database
        const products = await Item.find({
            _id: {
                $in: items.map(item => item.product)
            }
        });

        // Convert products into Stripe line items
        const line_items = products.map(product => {
            const cartItem = items.find(
                item => item.product === product._id.toString()
            );

            return {
                price_data: {
                    currency: "pkr",
                    product_data: {
                        name: product.name,
                    },
                    // converting to paisa
                    unit_amount: product.discountedPrice * 100,
                },

                quantity: cartItem.quantity
            };
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',

            line_items,

            metadata: {
                userId: req.user.userID,
                shippingAddress: JSON.stringify(req.body.shippingAddress),
                items: JSON.stringify(items),
            },

            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.json({
            url: session.url
        })
    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Payment session creation failed",
        });
    }
})

export default router;