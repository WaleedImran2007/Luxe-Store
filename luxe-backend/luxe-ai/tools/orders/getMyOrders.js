import Order from "../../../models/Order.js";

export async function getMyOrders(context, step, user) {
    const requestedLimit = Number(step.input?.limit);
    const limit = requestedLimit > 0 ? requestedLimit : 5;

    const orders = await Order.find({ user: user.userID })
        .populate("items.product", "name")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    if (orders.length === 0) {
        context.directReply = "You don't have any orders yet.";
        return;
    }

    context.myOrders = orders.map(order => ({
        orderId: order._id.toString(),
        status: order.status,
        totalPrice: order.totalPrice,
        placedOn: order.createdAt,
        items: order.items
            .filter(item => item.product)
            .map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
    }));
}
