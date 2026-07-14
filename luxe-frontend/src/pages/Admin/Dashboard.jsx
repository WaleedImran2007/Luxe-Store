import {
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Clock,
    UserRound
} from "lucide-react";

import { useState, useEffect } from "react";

import RevenueChart from "../../components/RevenueChart.jsx";
import OrderChart from "../../components/OrderChart.jsx";

import CountUp from 'react-countup';

import api from '../../../api/api.js';

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(null);


    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/admin/dashboard`);
                setDashboard(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    const stats = [
        {
            title: "Products",
            value: dashboard?.totalProducts,
            icon: Package,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Users",
            value: dashboard?.totalUsers,
            icon: Users,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Orders",
            value: dashboard?.totalOrders,
            icon: ShoppingCart,
            color: "bg-orange-100 text-orange-600",
        },
        {
            title: "Revenue",
            value: <CountUp
                end={dashboard?.totalRevenue}
                duration={2}
                separator=","
            />,
            icon: DollarSign,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-black border-r-black animate-spin"></div>

                    <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-gray-500 animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Here's what's happening with your store today.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

                {stats.map((item, index) => {

                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200"
                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        {item.title}
                                    </p>

                                    <h2 className="text-3xl font-bold mt-3 text-gray-800">
                                        {item.value}
                                    </h2>

                                    <div className="flex items-center gap-2 mt-4 text-green-600 text-sm">
                                        <TrendingUp size={16} />
                                        <span>+12% this month</span>
                                    </div>

                                </div>

                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}
                                >
                                    <Icon size={30} />
                                </div>

                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Charts */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

                {/* Revenue */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Revenue Overview
                    </h2>


                    {
                        dashboard && (
                            <RevenueChart
                                revenueData={dashboard.revenueData}
                            />
                        )
                    }

                </div>

                {/* Orders */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Orders Overview
                    </h2>

                    <OrderChart statusData={dashboard?.statusData} />

                </div>

            </div>

            {/* Bottom Section */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

                {/* Recent Orders */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    <div className="flex items-center gap-2 mb-5">

                        <Clock className="text-blue-600" />

                        <h2 className="text-xl font-semibold text-gray-800">
                            Recent Orders
                        </h2>

                    </div>

                    <div className="space-y-4">

                        {dashboard?.recentOrders?.map((order) => (

                            <div
                                key={order._id}
                                className="flex justify-between items-center border-b pb-3"
                            >
                                <div>

                                    <p className="font-semibold text-gray-800">
                                        Order #{order._id.slice(-6).toUpperCase()}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {order.user?.username}
                                    </p>

                                </div>

                                <div className="text-right">

                                    <p className="font-semibold">
                                        Rs. {order.totalPrice.toLocaleString()}
                                    </p>

                                    <span
                                        className={`inline-block mt-1 px-3 py-1 rounded-full text-sm
                                        ${order.status === "Delivered"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {order.status}
                                    </span>

                                </div>
                            </div>

                        ))}

                    </div>

                </div>

                {/* Latest Users */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    <div className="flex items-center gap-2 mb-5">

                        <UserRound className="text-purple-600" />

                        <h2 className="text-xl font-semibold text-gray-800">
                            Latest Users
                        </h2>

                    </div>

                    <div className="space-y-4">
                        {dashboard?.recentUsers?.map((user, index, arr) => {
                            const avatarInitials = user.username ? user.username.charAt(0).toUpperCase() : '?';

                            const formattedDate = user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })
                                : 'Recent';

                            return (
                                <div
                                    key={user._id}
                                    className={`flex items-center justify-between gap-3 py-3 transition-colors duration-200 hover:bg-gray-50/50 px-2 rounded-lg ${index !== arr.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    {/* Left Side Container (Forced to respect layout boundaries using min-w-0) */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Circular Initials Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-blue-600 border border-blue-100 shadow-sm shrink-0">
                                            {avatarInitials}
                                        </div>

                                        {/* User Details (min-w-0 tells flexbox it's allowed to shrink smaller than its text length) */}
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-gray-800 text-sm capitalize truncate">
                                                {user.username}
                                            </span>
                                            <span className="text-xs text-gray-500 font-normal truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Date Badge (shrink-0 prevents the date from collapsing or squishing) */}
                                    <div className="text-xs font-medium text-gray-400 bg-gray-100/70 px-2.5 py-1 rounded-full shrink-0">
                                        {formattedDate}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;