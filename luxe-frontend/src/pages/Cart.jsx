import { useContext } from "react";
import { CartContext } from "../../store/CartContext";
import { Link } from "react-router-dom";
import { Trash2 } from 'lucide-react';
import toast from "react-hot-toast";

function Cart() {
    const {
        cart,
        loading,
        updateQuantity,
        removeFromCart,
    } = useContext(CartContext);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading...
            </div>
        );
    }

    if (!cart.length) {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center text-center">
                <h2 className="text-3xl font-bold text-navy-900">
                    Your Cart is Empty
                </h2>

                <p className="text-stone-500 mt-3">
                    Looks like you haven't added anything yet.
                </p>

                <Link
                    to="/shop"
                    className="mt-8 px-8 py-3 bg-navy-900 text-white rounded-xl hover:bg-amber-500 transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const total = cart.reduce(
        (sum, item) => sum + item.product.discountedPrice * item.quantity,
        0
    );

    console.log(cart);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <h1 className="text-4xl font-bold text-navy-900 mb-10">
                Shopping Cart
            </h1>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* LEFT */}

                <div className="lg:col-span-2 space-y-6">

                    {cart.map((item) => (

                        <div
                            key={item.product._id}
                            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col sm:flex-row gap-5"
                        >

                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/items/${item.product.image}`}
                                alt={item.product.name}
                                className="w-full h-48 sm:w-32 sm:h-32 rounded-xl object-cover"
                            />

                            <div className="flex-1">

                                <Link to={`/product/${item.product._id}`}>
                                    <h2 className="text-xl font-semibold hover:text-yellow-400">
                                        {item.product.name}
                                    </h2>
                                </Link>

                                <p className="text-amber-500 font-bold text-lg mt-2">
                                    Rs. {item.product.discountedPrice.toLocaleString()}
                                </p>

                                <div className="flex items-center gap-3 mt-5">

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.product._id,
                                                item.quantity - 1
                                            )
                                        }
                                        className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200"
                                    >
                                        −
                                    </button>

                                    <span className="font-semibold">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.product._id,
                                                item.quantity + 1
                                            )
                                        }
                                        className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>

                            <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end">

                                <button
                                    onClick={() => {
                                        removeFromCart(item.product._id)
                                        toast("Removed from cart", {
                                            icon: "🗑️",
                                            style: {
                                                background: "#ef4444",
                                                color: "#fff",
                                            },
                                        });
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={24} />
                                </button>

                                <p className="font-bold text-lg">
                                    Rs. {(item.product.discountedPrice * item.quantity).toLocaleString()}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

                {/* RIGHT */}

                <div className="bg-white rounded-2xl shadow-sm border p-6 h-fit sticky top-24">

                    <h2 className="text-2xl font-bold mb-6">
                        Order Summary
                    </h2>

                    <div className="flex justify-between mb-4">

                        <span>Items</span>

                        <span>{cart.length}</span>

                    </div>

                    <div className="flex justify-between mb-6">

                        <span>Total</span>

                        <span className="font-bold text-xl">
                            Rs. {total.toLocaleString()}
                        </span>

                    </div>

                    <Link to={'/checkout'}>
                        <button className="w-full py-3 rounded-xl bg-navy-900 text-white hover:bg-amber-500 transition">
                            Proceed to Checkout
                        </button>
                    </Link>

                    <Link
                        to="/shop"
                        className="block text-center mt-4 text-navy-900 hover:text-amber-500"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Cart;