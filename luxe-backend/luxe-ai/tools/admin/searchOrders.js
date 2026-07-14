import Order from "../../../models/Order.js";
import User from "../../../models/User.js";
import mongoose from "mongoose";

export async function searchOrders(context, step, user) {
    if (user.role !== 'Admin') {
        context.error = 'You donot have permission to view order information';
        return;
    }

    const { status, username, orderID } = step.input || {}

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (orderID) {
        const orderFound = await Order.findOne({
            $or: [
                { _id: orderID },
                { _id: { $regex: `${orderID}$`, $options: 'i' } }
            ]
        });

        if (!orderFound) {
            context.directReply = `${orderID}" doesn't look like a valid order ID.`

            return;
        }

        filter._id = orderFound._id;

    }

    if (username) {
        const matchedUser = await User.findOne({
            username: { $regex: username, $options: 'i' }
        }).lean();

        if (!matchedUser) {
            context.directReply = `No user found with the name ${username}`;

            return;
        }

        filter.user = new mongoose.Types.ObjectId(matchedUser._id.toString());

    };

    const orders = await Order.find(filter)
        .populate("user", "username")
        .populate("items.product", "name")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    if (orders.length === 0) {
        context.directReply = "No orders found matching those criteria.";
        return;
    }

    context.orders = orders.map(o => ({
        orderID: o._id.toString(),
        customer: o.user?.username,
        status: o.status,
        totalPrice: o.totalPrice,
        placedOn: o.createdAt,
        items: o.items
            .filter(i => i.product)
            .map(i => ({ name: i.product.name, quantity: i.quantity }))
    }))

}