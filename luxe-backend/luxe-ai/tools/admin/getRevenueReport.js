import Order from "../../../models/Order.js";

export async function getRevenueReport(context, step, user) {
    if (user.role !== "Admin") {
        context.error = "You don't have permission to view revenue information.";
        return;
    }

    // TOTAL REVENUE
    const revenue = await Order.aggregate([
        {
            $match: { status: 'Delivered' }
        },

        {
            $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } }
        }
    ]);

    const totalRevenue = revenue.length ? revenue[0].totalRevenue : 0

    // LAST SIX MONTHS
    const orderRevenue = await Order.aggregate([
        {
            $match: { status: 'Delivered' }
        },

        {
            $group: { _id: { $month: '$createdAt'}, revenue: { $sum: "$totalPrice" } }
        },

        {
            $sort: { _id: 1 }
        }
    ]);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const revenueData = months.map((month, index) => {
        const found = orderRevenue.find(o => o._id === index + 1);
        return { month, revenue: found ? found.revenue : 0 };
    });

    const currentMonth = new Date().getMonth();
    const lastSixMonths = [];

    for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        lastSixMonths.push(revenueData[monthIndex]);
    }

    context.revenueReport = {
        totalRevenue,
        monthly: lastSixMonths,
    };
}
