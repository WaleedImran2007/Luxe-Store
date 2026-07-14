import express from "express";
import stripe from "../config/stripe.js";

import Item from "../models/Item.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post(
    "/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {

        const sig = req.headers["stripe-signature"];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );

        } catch (err) {
            console.log("Webhook Error:", err.message);
            return res.status(400).send(
                `Webhook Error: ${err.message}`
            );
        }


        console.log("Webhook received:", event.type);


        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const userId = session.metadata.userId;

            const items = JSON.parse(session.metadata.items);

            const shippingAddress = JSON.parse(
                session.metadata.shippingAddress
            );

            let orderItems = [];
            let totalPrice = 0;


            for (const item of items) {
                const product = await Item.findById(item.product);

                if (!product) {
                    console.log("Product not found");
                    continue;
                }

                if (item.quantity > product.stock) {
                    console.log(`${product.name} is out of stock.`);
                    continue;
                }

                product.stock -= item.quantity;

                await product.save();

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.discountedPrice,
                });

                await Cart.findOneAndUpdate(
                    { user: userId },
                    { items: [] }
                );

                totalPrice += product.discountedPrice * item.quantity;
            }

            const order = new Order({
                user: userId,
                items: orderItems,
                shippingAddress,
                totalPrice,
                paymentMethod: "Card",
                status: "Processing"
            });

            await order.save();
            console.log("Order created:", order._id);
        }

        res.json({
            received: true
        });
    }
);


export default router;