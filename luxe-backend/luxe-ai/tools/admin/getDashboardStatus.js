import Item from "../../../models/Item.js";
import User from "../../../models/User.js";
import Order from "../../../models/Order.js";

export async function getDashboardStatus(context, step, user) {
    if (user.role !== "Admin") {
        context.error = "You don't have permission to view dashboard information.";
        return;
    }

    const totalProducts = await Item.countDocuments({});
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const revenue = await Order.aggregate([
        { $match: { status: "Delivered" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = revenue.length ? revenue[0].totalRevenue : 0;

    const orderStatusAgg = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusData = {
        Pending: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
    };

    orderStatusAgg.forEach(item => {
        statusData[item._id] = item.count;
    });

    context.dashboard = {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
        orderStatus: statusData,
    };
}
