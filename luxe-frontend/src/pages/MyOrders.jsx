import { useEffect, useState } from "react";
import api from "../../api/api.js";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/order");
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold mb-8">
                My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-10 text-center">
                    <h2 className="text-2xl font-semibold">
                        No Orders Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Start shopping and place your first order.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="font-bold text-lg">
                                        Order #{order._id.slice(-6)}
                                    </h2>

                                    <p className="text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div
                                    className={`px-4 py-2 rounded-full text-sm font-semibold
                                    ${order.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : order.status === "Shipped"
                                                ? "bg-blue-100 text-blue-700"
                                                : order.status === 'Cancelled' 
                                                ? 'bg-red-500 text-white'
                                                : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {order.status}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between border-b pb-3"
                                    >
                                        <div>
                                            <h3 className="font-medium">
                                                {item.product?.name || "Product no longer available"}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <div className="font-semibold">
                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500">
                                        Payment
                                    </p>

                                    <p className="font-medium">
                                        {order.paymentMethod}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-gray-500">
                                        Total
                                    </p>

                                    <h2 className="text-2xl font-bold">
                                        Rs. {order.totalPrice.toLocaleString()}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;