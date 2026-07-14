import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../store/CartContext";
import api from "../../api/api.js";
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const Checkout = () => {
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [user, setUser] = useState({});
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const { cart } = useContext(CartContext);

    const fetchUser = async () => {
        const res = await api.get('/user/profile');
        return res.data;
    }

    useEffect(() => {
        const loadUser = async () => {
            const temp = await fetchUser();
            setUser(temp);
            console.log(temp);
        }

        loadUser();
    }, [])

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.product.discountedPrice * item.quantity,
        0
    );

    const placeOrder = async () => {
        if (isPlacingOrder) return;

        const order = {
            items: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),

            shippingAddress: {
                fullName: user.username,
                phone: user.phone,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode,
                country: user.country,
            },

            paymentMethod
        }

        try {
            setIsPlacingOrder(true);

            if (paymentMethod === 'Card') {
                const res = await api.post('/payment/create-checkout-session', order);

                window.location.href = res.data.url;
            }

            else {
                await api.post('/order', order);
                // Empty Cart
                await api.delete('/cart/clear');

                toast.success('Order Placed Successfully');

                navigate('/my-orders');
            }

        }

        catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setIsPlacingOrder(false);
        }
    }

    return (
        <div className="min-h-screen bg-stone-100">

            <div className="grid lg:grid-cols-2">

                {/* LEFT IMAGE */}

                <div className="hidden lg:block h-screen sticky top-0 overflow-hidden">

                    <img
                        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600&auto=format&fit=crop"
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/55"></div>

                    <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">

                        <p className="uppercase tracking-[8px] text-amber-400 mb-4">
                            Secure Checkout
                        </p>

                        <h1 className="text-6xl font-bold leading-tight">
                            Almost
                            <br />
                            Yours.
                        </h1>

                        <p className="mt-8 text-lg text-stone-200 leading-8 max-w-md">
                            Complete your purchase securely. Your favorite
                            products are waiting for you.
                        </p>

                        <div className="mt-12 space-y-5">

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                    🚚
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Fast Delivery
                                    </h3>
                                    <p className="text-stone-300 text-sm">
                                        Nationwide shipping
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                    🔒
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Secure Payment
                                    </h3>
                                    <p className="text-stone-300 text-sm">
                                        100% protected checkout
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                    ⭐
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Premium Quality
                                    </h3>
                                    <p className="text-stone-300 text-sm">
                                        Trusted by thousands
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="h-screen overflow-y-auto">

                    <div className="max-w-xl mx-auto px-6 py-10">

                        <h1 className="text-4xl font-bold text-stone-800">
                            Checkout
                        </h1>

                        <p className="text-stone-500 mt-2 mb-8">
                            Please review your information before placing the
                            order.
                        </p>

                        {/* SHIPPING */}

                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">

                            <div className="flex justify-between items-center mb-5">

                                <h2 className="text-xl font-semibold">
                                    Shipping Address
                                </h2>

                                <Link to={'/profile'}>
                                    <button className="text-amber-500 hover:text-amber-600 font-medium">
                                        Edit
                                    </button>
                                </Link>

                            </div>

                            <div className="space-y-3 text-stone-700">

                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Name
                                    </span>
                                    <span className="truncate max-w-80 text-right">{user.username}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Phone
                                    </span>
                                    <span className="truncate max-w-80 text-right">{user.phone}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Address
                                    </span>
                                    <span className="truncate max-w-80 text-right">{user.address}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        City
                                    </span>
                                    <span className="truncate max-w-80 text-right">{user.city}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Postal Code
                                    </span>
                                    <span className="truncate max-w-80 text-right">{user.postalCode}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium">
                                        Country
                                    </span>
                                    <span className="truncate max-w-80 text-right">{user.country}</span>
                                </div>

                            </div>

                        </div>

                        {/* PAYMENT */}

                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-6">

                            <h2 className="text-xl font-semibold mb-5">
                                Payment Method
                            </h2>

                            <label
                                className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition mb-4 ${paymentMethod === "Cash on Delivery"
                                    ? "border-amber-500 bg-amber-50"
                                    : "border-stone-300"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    checked={
                                        paymentMethod ===
                                        "Cash on Delivery"
                                    }
                                    onChange={() =>
                                        setPaymentMethod(
                                            "Cash on Delivery"
                                        )
                                    }
                                />

                                <div>
                                    <h3 className="font-semibold">
                                        Cash on Delivery
                                    </h3>

                                    <p className="text-sm text-stone-500">
                                        Pay after receiving your order.
                                    </p>
                                </div>

                            </label>

                            <label
                                className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition ${paymentMethod === "Card"
                                    ? "border-amber-500 bg-amber-50"
                                    : "border-stone-300"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    checked={paymentMethod === "Card"}
                                    onChange={() =>
                                        setPaymentMethod("Card")
                                    }
                                />

                                <div>
                                    <h3 className="font-semibold">
                                        Credit / Debit Card
                                    </h3>

                                    <p className="text-sm text-stone-500">
                                        Secure online payment.
                                    </p>
                                </div>

                            </label>

                        </div>

                        {/* ORDER */}

                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">

                            <h2 className="text-xl font-semibold mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-5">

                                {cart.map((item) => (

                                    <div
                                        key={item.product._id}
                                        className="flex justify-between items-center border-b border-stone-200 pb-4"
                                    >

                                        <div>

                                            <h3 className="font-semibold">
                                                {item.product.name}
                                            </h3>

                                            <p className="text-sm text-stone-500">
                                                Quantity : {item.quantity}
                                            </p>

                                        </div>

                                        <div className="font-semibold text-lg">
                                            Rs.{" "}
                                            {(
                                                item.product.discountedPrice *
                                                item.quantity
                                            ).toLocaleString()}
                                        </div>

                                    </div>

                                ))}

                            </div>

                            <div className="mt-8 space-y-3">

                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>
                                        Rs.{" "}
                                        {totalPrice.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>

                                <div className="border-t pt-4 flex justify-between text-2xl font-bold">
                                    <span>Total</span>

                                    <span className="text-amber-600">
                                        Rs.{" "}
                                        {totalPrice.toLocaleString()}
                                    </span>

                                </div>

                            </div>

                            <button
                                onClick={() => placeOrder()}
                                disabled={isPlacingOrder}
                                className="mt-8 w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isPlacingOrder ? "Placing Order..." : "Place Order"}
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Checkout;