import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../../store/WishlistContext";
import { CartContext } from "../../store/CartContext";

function Wishlist() {
    const { wishlist, loading, removeFromWishlist } = useContext(WishlistContext);

    const { addToCart } = useContext(CartContext);

    const handleAddToCart = async (productID) => {
        await addToCart(productID, 1);
        alert('Added To Cart')
        await removeFromWishlist(productID);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <h2 className="text-xl font-semibold">Loading...</h2>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <div className="text-6xl mb-4">❤️</div>

                <h1 className="text-3xl font-bold mb-3">
                    Your Wishlist is Empty
                </h1>

                <p className="text-gray-600 mb-8">
                    Save your favorite products and they'll appear here.
                </p>

                <Link
                    to="/shop"
                    className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">
                My Wishlist ({wishlist.length})
            </h1>

            <div className="space-y-6">
                {wishlist.map((item) => (
                    <div
                        key={item.product._id}
                        className="flex flex-col md:flex-row items-center gap-6 border rounded-xl p-5 shadow-sm"
                    >
                        <img
                            src={`${import.meta.env.VITE_API_URL}/uploads/items/${item.product.image}`}
                            alt={item.product.name}
                            className="w-36 h-36 object-cover rounded-lg"
                        />

                        <div className="flex-1">
                            <Link to={`/product/${item.product._id}`}>
                            <h2 className="text-xl font-semibold hover:text-yellow-400">
                                {item.product.name}
                            </h2>
                            </Link>

                            <p className="text-gray-500 mt-1">
                                {item.product.category?.name}
                            </p>

                            <p className="text-2xl font-bold mt-3">
                                ${item.product.discountedPrice}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <button
                                onClick={() =>
                                    handleAddToCart(item.product._id)
                                }
                                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={() =>
                                    removeFromWishlist(item.product._id)
                                }
                                
                                className="border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Wishlist;