import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

function OrderSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">

                <CheckCircle
                    className="mx-auto text-green-500 mb-6"
                    size={90}
                    strokeWidth={1.5}
                />

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Order Placed Successfully!
                </h1>

                <p className="text-gray-600 leading-relaxed mb-8">
                    Thank you for shopping with <span className="font-semibold">LUXE Store</span>.
                    We've received your order and will begin processing it shortly.
                    You'll receive updates as your order moves through shipping.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                    <p className="text-green-700 font-medium">
                        ✓ Payment received successfully.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/my-orders"
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition font-medium"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/shop"
                        className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                        Continue Shopping
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default OrderSuccess;