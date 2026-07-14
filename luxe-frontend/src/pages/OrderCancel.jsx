import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

function OrderCancel() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">

                <XCircle
                    className="mx-auto text-red-500 mb-6"
                    size={90}
                    strokeWidth={1.5}
                />

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Payment Cancelled
                </h1>

                <p className="text-gray-600 leading-relaxed mb-8">
                    Your payment was cancelled and your order was not completed.
                    No charges have been made to your card.
                    You can return to checkout whenever you're ready.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                    <p className="text-red-700 font-medium">
                        Payment was not completed.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/cart"
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition font-medium"
                    >
                        Return to Cart
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

export default OrderCancel;