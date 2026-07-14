import Item from "../../../models/Item.js";
import Order from "../../../models/Order.js";

export async function cancelOrder(context, step, user) {
    const orderId = step.input?.orderId?.trim();

    let order;

    if (orderId) {
        const orders = await Order.findOne({ user: user.userID });

        order = orders.find(
            o => o._id.toString() === orderId || o._id.toString().endsWith(orderId)
        );

        if (!order) {
            context.directReply = `I couldn't find an order matching "${orderId}".`;
            return;
        }
    }

    else {
        order = await Order.findOne({ user: user.userID }).sort({ createdAt: -1 });

        if (!order) {
            context.directReply = "You don't have any pending orders that can be cancelled.";
            return;
        }
    }

    if (order.user.toString() !== user.userID) {
        context.error = "You don't have permission to cancel this order.";
        return;
    }

    if (order.status !== 'Pending') {
        context.directReply = `Order ${order._id} can't be cancelled because it's already "${order.status}".`;
        return;
    }

    // Restock the items back into inventory.
    for (const item of order.items) {
        await Item.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    order.status = 'Cancelled';
    await order.save();

    context.cancelledOrder = {
        orderId: order._id.toString(),
        message: "Your order has been cancelled and the items have been restocked.",
    };

}