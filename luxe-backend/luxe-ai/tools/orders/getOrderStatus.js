import Order from "../../../models/Order.js";

export async function getOrderStatus(context, step, user) {
    const orderId = step.input?.orderId?.trim();

    let order;

    if (orderId) {
        const orders = await Order.find({ user: user.userID }).lean();
        order = orders.find(
            o => o._id.toString() === orderId || o._id.toString().endsWith(orderId)
        );

        if (!order) {
            context.directReply = `I couldn't find an order matching "${orderId}".`;
            return;
        }
    } else {
        order = await Order.findOne({ user: user.userID })
            .sort({ createdAt: -1 })
            .lean();

        if (!order) {
            context.directReply = "You don't have any orders yet.";
            return;
        }
    }

    context.orderStatus = {
        orderId: order._id.toString(),
        status: order.status,
        totalPrice: order.totalPrice,
        placedOn: order.createdAt,
    };
}
