import { useEffect, useMemo, useState } from "react";
import api from "../../../api/api.js";
import { Package, Search, Calendar, User, DollarSign, Trash2 } from "lucide-react";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/admin/all-orders");
            setOrders(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const name = order.shippingAddress?.fullName?.toLowerCase() || "";

            return (
                order._id.toLowerCase().includes(search.toLowerCase()) ||
                name.includes(search.toLowerCase())
            );
        });
    }, [orders, search]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-50 text-green-800 border border-green-200";

            case "Shipped":
                return "bg-blue-50 text-blue-800 border border-blue-200";

            case "Processing":
                return "bg-amber-50 text-amber-800 border border-amber-300";

            case "Cancelled":
                return "bg-red-50 text-red-800 border border-red-200";

            default:
                return "bg-neutral-100 text-neutral-700 border border-neutral-300";
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const previousOrders = orders;
        setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        setUpdatingId(orderId);

        try {
            await api.put(`/admin/update-order/${orderId}`, { status: newStatus });
        } catch (err) {
            console.log(err);
            setOrders(previousOrders);
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (orderId) => {
        const confirmed = window.confirm(
            "Delete this order permanently? This cannot be undone."
        );
        
        if (!confirmed) return;

        const previousOrders = orders;
        setOrders((prev) => prev.filter((o) => o._id !== orderId));

        try {
            await api.delete(`/admin/delete-order/${orderId}`);
        } catch (err) {
            console.log(err);
            setOrders(previousOrders);
            alert("Failed to delete order. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-[#B8860B] animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">

            {/* Heading */}

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-neutral-200 pb-6">

                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#B8860B] font-semibold mb-1">
                        LUXE Admin
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
                        Orders
                    </h1>

                    <p className="text-neutral-500 mt-1 text-sm">
                        {filteredOrders.length} total order{filteredOrders.length !== 1 && "s"}
                    </p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        size={17}
                    />

                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] outline-none transition-colors"
                    />
                </div>

            </div>

            {/* Desktop */}

            <div className="hidden lg:block overflow-x-auto rounded-xl bg-white shadow-sm border border-neutral-200">

                <table className="w-full text-sm">

                    <thead>

                        <tr className="text-left border-b border-neutral-200 bg-neutral-900 text-neutral-100">

                            <th className="px-5 py-3.5 font-medium">Order ID</th>
                            <th className="px-5 py-3.5 font-medium">Customer</th>
                            <th className="px-5 py-3.5 font-medium">Items</th>
                            <th className="px-5 py-3.5 font-medium">Total</th>
                            <th className="px-5 py-3.5 font-medium">Status</th>
                            <th className="px-5 py-3.5 font-medium">Date</th>
                            <th className="px-5 py-3.5 font-medium text-right">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredOrders.map((order) => (
                            <tr
                                key={order._id}
                                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                            >
                                <td className="px-5 py-4 font-mono text-xs text-neutral-500">
                                    #{order._id.slice(-8)}
                                </td>

                                <td className="px-5 py-4 font-medium text-neutral-800">
                                    {order.shippingAddress?.fullName}
                                </td>

                                <td className="px-5 py-4 text-neutral-600">
                                    {order.items.length}
                                </td>

                                <td className="px-5 py-4 font-semibold text-neutral-900">
                                    Rs. {order.totalPrice.toLocaleString()}
                                </td>

                                <td className="px-5 py-4">

                                    <select
                                        value={order.status}
                                        disabled={updatingId === order._id}
                                        onChange={(e) =>
                                            handleStatusChange(order._id, e.target.value)
                                        }
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50 ${getStatusStyle(
                                            order.status
                                        )}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>

                                </td>

                                <td className="px-5 py-4 text-neutral-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-5 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(order._id)}
                                        title="Delete order"
                                        className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="text-red-600" size={16} />
                                    </button>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

            {/* Mobile */}

            <div className="lg:hidden space-y-4">

                {filteredOrders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5"
                    >

                        <div className="flex justify-between items-start mb-4">

                            <div>
                                <h2 className="font-mono text-xs text-neutral-400 mb-0.5">
                                    #{order._id.slice(-8)}
                                </h2>
                                <p className="font-semibold text-neutral-900">
                                    {order.shippingAddress?.fullName}
                                </p>
                            </div>

                            <button
                                onClick={() => handleDelete(order._id)}
                                title="Delete order"
                                className="p-2 -mt-1 -mr-1 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>

                        </div>

                        <div className="space-y-2.5 text-sm text-neutral-600 mb-4">

                            <div className="flex items-center gap-2">
                                <Package size={15} className="text-neutral-400" />
                                {order.items.length} item{order.items.length !== 1 && "s"}
                            </div>

                            <div className="flex items-center gap-2">
                                <DollarSign size={15} className="text-neutral-400" />
                                <span className="font-semibold text-neutral-900">
                                    Rs. {order.totalPrice.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar size={15} className="text-neutral-400" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>

                        </div>

                        <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50 ${getStatusStyle(
                                order.status
                            )}`}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>

                    </div>
                ))}

            </div>

            {filteredOrders.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 mt-8 py-16 text-center">

                    <Package
                        size={48}
                        className="mx-auto text-neutral-300 mb-4"
                    />

                    <h2 className="text-lg font-serif font-semibold text-neutral-800">
                        No Orders Found
                    </h2>

                    <p className="text-neutral-500 mt-1 text-sm">
                        Try adjusting your search.
                    </p>

                </div>
            )}

        </div>
    );
};

export default AdminOrders;