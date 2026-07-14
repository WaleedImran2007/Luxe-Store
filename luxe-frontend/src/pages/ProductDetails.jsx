import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api.js";

import { AuthContext } from '../../store/AuthContext.jsx';

import toast from "react-hot-toast";

import {
    ShoppingCart,
    Heart,
    Star,
    Minus,
    Plus,
    Package,
    Trash2
} from "lucide-react";
import { CartContext } from "../../store/CartContext.jsx";
import { WishlistContext } from "../../store/WishlistContext.jsx";

const ProductDetails = () => {

    const { id } = useParams();

    const { decodedUser } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [comment, setComment] = useState('');
    const [myReview, setMyReview] = useState(null);

    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, wishlist } = useContext(WishlistContext);

    const [isWishlisted, setIsWishlisted] = useState(false);

    const fetchProduct = async () => {
        try {

            const res = await api.get(`/items/${id}`);
            setProduct(res.data);

        } catch (err) {
            console.log(err);
        }

        finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/${id}`);
            console.log(res.data);
            setReviews(res.data);

            const mine = res.data?.find(
                review => review.user._id === decodedUser?.userID
            );

            if (mine) {
                setMyReview(mine)
                setRating(mine.rating);
                setComment(mine.comment);
            }
        }

        catch (err) {
            console.log(err);
        }
    }

    const handleSubmitReview = async () => {
        try {
            setSubmitting(true);
            await api.post(`/reviews/${id}`, { rating, comment });

            toast.success('Review Saved Successfully');

            await fetchProduct();
            await fetchReviews();

        } catch (err) {
            console.log(err);
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        fetchProduct();
        fetchReviews();

        setIsWishlisted(!!wishlist?.find(item => item.product._id === id));

    }, [id, decodedUser, wishlist]);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-14 h-14 rounded-full border-4 border-gray-300 border-t-indigo-600 animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-40 text-3xl">
                Product Not Found
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">

            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid lg:grid-cols-2 gap-14">

                    {/* IMAGE */}

                    <div>

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/items/${product.image}`}
                                alt={product.name}
                                className="w-full h-[550px] object-contain"
                            />

                        </div>

                    </div>

                    {/* DETAILS */}

                    <div>

                        <h1 className="text-4xl font-bold text-gray-800">
                            {product.name}
                        </h1>

                        {/* Rating */}

                        <div className="flex items-center gap-3 mt-5">

                            <div className="flex">

                                {[1, 2, 3, 4, 5].map((star) =>

                                    <Star
                                        key={star}
                                        size={22}
                                        fill={
                                            star <= Math.round(product.rating)
                                                ? "#FACC15"
                                                : "transparent"
                                        }
                                        className="text-yellow-400"
                                    />

                                )}

                            </div>

                            <span className="text-gray-600">

                                {product.rating?.toFixed(1)}

                            </span>

                            <span className="text-gray-400">

                                ({product.numOfReviews} Reviews)

                            </span>

                        </div>

                        {/* PRICE */}

                        <div className="mt-8 flex items-center gap-4">

                            <span className="text-4xl font-bold text-indigo-700">
                                Rs. {product.discountedPrice}
                            </span>

                            <span className="text-2xl line-through text-gray-400">
                                Rs. {product.originalPrice}
                            </span>

                        </div>

                        {/* CATEGORY */}

                        <div className="mt-7 flex items-center gap-3">
                            <Package className="text-indigo-600" />

                            <span className="font-semibold">
                                {product.category?.name}
                            </span>

                        </div>

                        {/* STOCK */}

                        <div className="mt-4">

                            {
                                product.stock > 0 ?
                                    <span className="text-green-600 font-semibold">
                                        In Stock ({product.stock})
                                    </span>

                                    :

                                    <span className="text-red-600 font-semibold">
                                        Out Of Stock
                                    </span>
                            }

                        </div>

                        {/* DESCRIPTION */}

                        <div className="mt-8">

                            <h2 className="font-bold text-xl">
                                Description
                            </h2>

                            <p className="text-gray-600 leading-8 mt-3">
                                {product.description}
                            </p>

                        </div>

                        {/* QUANTITY */}

                        <div className="mt-10 flex items-center gap-5">
                            <div className="flex items-center border rounded-xl">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-5 py-3">

                                    <Minus />

                                </button>

                                <span className="px-6">
                                    {quantity}
                                </span>

                                <button
                                    disabled={quantity >= product.stock}
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-5 py-3">

                                    <Plus />

                                </button>

                            </div>

                        </div>

                        {/* BUTTONS */}

                        <div className="flex gap-4 mt-10">

                            <button
                                onClick={
                                    () => {
                                        addToCart(id, quantity)
                                        toast.success(`${product.name} Added to Cart`);
                                    }
                                }
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl flex justify-center gap-3 font-semibold">

                                <ShoppingCart />
                                Add To Cart
                            </button>

                            <button
                                onClick={
                                    () => {
                                        if (isWishlisted) {
                                            removeFromWishlist(id);
                                            toast('Removed From Wishlist', {
                                                icon: '🗑️',
                                                style: {
                                                    background: '#ef4444',
                                                    color: "#fff",
                                                }
                                            });
                                        } else {
                                            addToWishlist(id);
                                            toast.success('Added to Wishlist');
                                        }

                                        setIsWishlisted(!isWishlisted);
                                    }
                                }
                                className="w-16 bg-white shadow rounded-xl flex justify-center items-center">

                                <Heart fill={isWishlisted ? 'red' : 'transparent'} />

                            </button>

                        </div>

                    </div>

                </div>

                {/* Reviews */}

                <div className="bg-white rounded-3xl shadow-lg p-10 mt-16">

                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Reviews
                        </h2>

                        <span className="text-gray-500">
                            {product.numOfReviews} Reviews
                        </span>
                    </div>

                    <div className="mt-10 border rounded-2xl p-8 bg-gray-50">

                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                            {myReview ? "Edit Your Review" : "Write a Review"}
                        </h3>

                        {/* Rating */}

                        <div>

                            <label className="block text-gray-700 font-medium mb-3">
                                Your Rating
                            </label>

                            <div className="flex gap-2">

                                {
                                    [1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            <Star
                                                size={34}
                                                className="text-yellow-400 transition"
                                                fill={
                                                    star <= (hoveredRating || rating) ? "#FACC15" : "transparent"
                                                }
                                            />

                                        </button>
                                    ))
                                }

                            </div>

                        </div>

                        {/* Comment */}

                        <div className="mt-8">

                            <label className="block text-gray-700 font-medium mb-3">
                                Your Review
                            </label>

                            <textarea
                                rows={5}
                                maxLength={500}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this product..."
                                className="w-full rounded-xl border border-gray-300 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            <div className="flex justify-between mt-2 text-sm text-gray-500">

                                <span>
                                    Minimum 10 characters
                                </span>

                                <span>
                                    {comment?.length}/500
                                </span>

                            </div>

                        </div>

                        {/* Submit */}

                        <div className="mt-8 flex justify-end">

                            <button
                                onClick={handleSubmitReview}
                                disabled={
                                    submitting ||
                                    rating === 0 ||
                                    comment?.trim().length < 10
                                }
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : myReview
                                        ? "Update Review"
                                        : "Submit Review"}
                            </button>

                        </div>

                    </div>

                    {/* Reviews */}

                    <div className="mt-12">
                        {reviews?.length === 0 ? (

                            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-700">
                                    No Reviews Yet
                                </h3>

                                <p className="mt-2 text-gray-500">
                                    Be the first to share your experience with this product.
                                </p>
                            </div>

                        ) : (

                            <div className="space-y-6">

                                {reviews?.map((review) => (

                                    <div
                                        key={review._id}
                                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300"
                                    >

                                        {/* Header */}
                                        <div className="flex justify-between items-start">

                                            <div className="flex items-center gap-4">

                                                {/* Avatar */}
                                                <div className="w-14 h-14 rounded-full overflow-hidden bg-amber-500 flex items-center justify-center flex-shrink-0">

                                                    {review.user?.profileImage ? (

                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL}/uploads/pfp/${review.user.profileImage}`}
                                                            alt={review.user?.username || "User"}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <span className="text-white text-xl font-bold">
                                                            {review.user?.username?.[0]?.toUpperCase() || "U"}
                                                        </span>

                                                    )}

                                                </div>


                                                {/* Name + Stars */}
                                                <div>

                                                    <h4 className="font-semibold text-lg text-gray-900">
                                                        {review.user?.username || "Deleted User"}
                                                    </h4>

                                                    <div className="flex items-center gap-1 mt-1">

                                                        {[1, 2, 3, 4, 5].map((star) => (

                                                            <Star
                                                                key={star}
                                                                size={17}
                                                                className="text-yellow-400"
                                                                fill={
                                                                    star <= review.rating
                                                                        ? "#FACC15"
                                                                        : "transparent"
                                                                }
                                                            />

                                                        ))}

                                                        <span className="ml-2 text-sm text-gray-500">
                                                            {review.rating}/5
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            <div className="flex items-center gap-4">

                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>


                                                {review.user?._id === decodedUser.userID && (

                                                    <button
                                                        onClick={async () => {

                                                            if (!window.confirm("Delete your review?")) return;

                                                            try {

                                                                await api.delete(`/reviews/${id}`);

                                                                toast.success("Review deleted successfully.");

                                                                setMyReview(null);
                                                                setRating(0);
                                                                setComment("");

                                                                await fetchReviews();
                                                                await fetchProduct();

                                                            } catch (err) {

                                                                console.log(err);
                                                                toast.error("Failed to delete review.");

                                                            }

                                                        }}
                                                        className="w-10 h-10 rounded-full hover:bg-red-100 flex items-center justify-center transition-all group"
                                                    >

                                                        <Trash2
                                                            size={18}
                                                            className="text-red-500 group-hover:scale-110 transition-transform"
                                                        />

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                        {/* Review */}
                                        <div className="mt-5 pl-[72px]">

                                            <p className="text-gray-700 leading-7">
                                                {review.comment}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;