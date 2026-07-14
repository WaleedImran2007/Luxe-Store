import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CartContext } from '../../store/CartContext.jsx';
import { AuthContext } from '../../store/AuthContext.jsx'
import { WishlistContext } from '../../store/WishlistContext.jsx';

import toast from 'react-hot-toast';

import { Heart } from 'lucide-react';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const [showFilters, setShowFilters] = useState(false);

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

    const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('priceRange') || 'all');

    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

    const { addToCart } = useContext(CartContext);
    const { token } = useContext(AuthContext);
    const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

    // PAGINATION STATES
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 12;

    // Reset to page 1 whenever a filter/sort changes
    useEffect(() => {
        setPage(1);
    }, [selectedCategory, selectedPriceRange, sortBy]);

    // Sync state -> URL search params whenever page/filters/sort change.
    // Default values are omitted from the URL to keep it clean, and
    // `replace: true` avoids polluting browser history on every click.
    useEffect(() => {
        const params = {};

        if (page > 1) params.page = String(page);
        if (selectedCategory) params.category = selectedCategory;
        if (selectedPriceRange && selectedPriceRange !== 'all') params.priceRange = selectedPriceRange;
        if (sortBy && sortBy !== 'newest') params.sortBy = sortBy;

        setSearchParams(params, { replace: true });
    }, [page, selectedCategory, selectedPriceRange, sortBy, setSearchParams]);

    // Fetch categories once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);

                setCategories(res.data);
            }

            catch (err) {
                console.log(err);
            }
        }

        fetchCategories();
    }, []);

    // FETCH ITEMS WHEN PAGE CHANGES
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setIsLoading(true);

                const params = { page, limit, category: selectedCategory, priceRange: selectedPriceRange, sortBy };

                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/items`, { params });

                setItems(res.data.items);
                setTotalPages(res.data.totalPages);
                setTotalItems(res.data.totalItems);
            }

            catch (err) {
                console.log(err);
            }

            finally {
                setIsLoading(false);
            }
        }

        fetchItems();
    }, [page, selectedCategory, selectedPriceRange, sortBy]);

    const handleResetFilters = () => {
        setSelectedCategory('');
        setSelectedPriceRange('all');
        setSortBy('newest');
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const Filters = () => (
        <>
            {/* FILTERING CATEGORIES */}
            <div className="mb-8">
                <div className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-400 mb-4">
                    Categories
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setSelectedCategory("")}
                        className={`text-left text-sm py-1 transition-colors ${selectedCategory === ""
                            ? "text-amber-500 font-semibold"
                            : "text-stone-700 hover:text-amber-500"
                            }`}
                    >
                        All
                    </button>

                    {categories.map(category => (
                        <button
                            key={category._id}
                            onClick={() => setSelectedCategory(category._id)}
                            className={`text-left text-sm py-1 transition-colors ${selectedCategory === category._id
                                ? "text-amber-500 font-semibold"
                                : "text-stone-700 hover:text-amber-500"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* FILTER BY PRICE */}

            <div className='mb-8'>
                <div className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-400 mb-4">
                    Price Range
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='priceRange'
                            value='all'
                            checked={selectedPriceRange === 'all'}
                            onChange={(e) => setSelectedPriceRange(e.target.value)}

                        />
                        All
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='priceRange'
                            value='under1000'
                            checked={selectedPriceRange === 'under1000'}
                            onChange={(e) => setSelectedPriceRange(e.target.value)}

                        />
                        Under Rs. 1000
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='priceRange'
                            value='1000-2500'
                            checked={selectedPriceRange === '1000-2500'}
                            onChange={(e) => setSelectedPriceRange(e.target.value)}

                        />
                        Rs. 1000 - Rs. 2500
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='priceRange'
                            value='2500-4000'
                            checked={selectedPriceRange === '2500-4000'}
                            onChange={(e) => setSelectedPriceRange(e.target.value)}

                        />
                        Rs. 2500 - Rs. 4000
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='priceRange'
                            value='above4000'
                            checked={selectedPriceRange === 'above4000'}
                            onChange={(e) => setSelectedPriceRange(e.target.value)}

                        />
                        Over Rs. 4000
                    </label>
                </div>
            </div>

            {/* SORTING CONTAINER */}
            <div>
                <div className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-400 mb-4">
                    Sort By
                </div>

                <div className="flex flex-col gap-3 text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='itemSort'
                            value='newest'
                            checked={sortBy === 'newest'}
                            onChange={(e) => setSortBy(e.target.value)}

                        />
                        Newest
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='itemSort'
                            value='priceLow'
                            checked={sortBy === 'priceLow'}
                            onChange={(e) => setSortBy(e.target.value)}

                        />
                        Price: Low to High
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='itemSort'
                            value='priceHigh'
                            checked={sortBy === 'priceHigh'}
                            onChange={(e) => setSortBy(e.target.value)}

                        />
                        Price: High to Low
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='itemSort'
                            value='nameAZ'
                            checked={sortBy === 'nameAZ'}
                            onChange={(e) => setSortBy(e.target.value)}

                        />
                        Name: A-Z
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='itemSort'
                            value='nameZA'
                            checked={sortBy === 'nameZA'}
                            onChange={(e) => setSortBy(e.target.value)}

                        />
                        Name: Z-A
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name='itemSort'
                            value='bigDiscount'
                            checked={sortBy === 'bigDiscount'}
                            onChange={(e) => setSortBy(e.target.value)}

                        />
                        Biggest Discount
                    </label>

                </div>
            </div>

            {/* RESET FILTERS */}
            <button
                onClick={handleResetFilters}
                className="w-[80%] mt-8 flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm font-medium text-slate-700 transition-all hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h5M20 20v-5h-5M5.64 19A9 9 0 1020 15.36"
                    />
                </svg>

                Reset Filters
            </button>

        </>
    );

    const Pagination = () => {
        if (totalPages <= 1) return null;

        // CALCULATING RANGE OF PAGES
        const maxVisiblePages = 8;

        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pageNumbers = [];

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="w-full flex items-center justify-center gap-2 mt-10 mb-16 flex-wrap">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-500 hover:text-amber-500 transition-colors"
                >
                    Prev
                </button>

                {
                    startPage > 1 && (
                        <>
                            <button className='w-10 h-10 rounded-lg text-sm font-medium transition-colors border border-stone-300 text-stone-700 hover:border-amber-500 hover:text-amber-500' onClick={() => handlePageChange(1)}>1</button>

                            {startPage > 2 && <span>...</span>}
                        </>
                    )
                }

                {pageNumbers.map(num => (
                    <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === num
                            ? "bg-navy-900 text-white"
                            : "border border-stone-300 text-stone-700 hover:border-amber-500 hover:text-amber-500"
                            }`}
                    >
                        {num}
                    </button>
                ))}

                {
                    endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span>...</span>}

                            <button className='w-10 h-10 rounded-lg text-sm font-medium transition-colors border border-stone-300 text-stone-700 hover:border-amber-500 hover:text-amber-500' onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                        </>
                    )
                }

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-amber-500 hover:text-amber-500 transition-colors"
                >
                    Next
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Overlay */}
            {showFilters && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setShowFilters(false)}
                />
            )}

            {/* Mobile Filter Drawer */}
            <div
                className={`
                    fixed top-0 left-0 h-screen w-[300px]
                    bg-white z-50 p-6
                    transition-transform duration-300
                    lg:hidden
                    overflow-auto
                    ${showFilters ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">
                        Filters
                    </h2>

                    <button
                        onClick={() => setShowFilters(false)}
                        className="text-3xl"
                    >
                        ×
                    </button>
                </div>

                <Filters />
            </div>

            <div className="min-h-screen px-5 md:px-8 mt-[70px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="font-bold text-3xl md:text-4xl text-navy-900">
                            All Products
                        </h1>

                        <p className="text-stone-500 mt-1">
                            {totalItems} items
                        </p>
                    </div>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden flex items-center gap-2 border px-4 py-2 rounded-xl mt-4 md:mt-0 bg-white shadow-sm"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5h18M6 12h12M10 19h4"
                            />
                        </svg>

                        Filters
                    </button>
                </div>

                <div className="flex gap-10 mb-12">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-[260px] shrink-0">
                        <div className='sticky top-12'>
                            <Filters />
                        </div>
                    </div>

                    {/* Products + Pagination */}
                    <div className="flex-1 flex flex-col">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded-2xl overflow-hidden border border-stone-200 animate-pulse"
                                    >
                                        <div className="w-full h-[340px] bg-stone-200" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-3 w-1/3 bg-stone-200 rounded" />
                                            <div className="h-4 w-2/3 bg-stone-200 rounded" />
                                            <div className="h-4 w-1/2 bg-stone-200 rounded" />
                                            <div className="h-10 w-full bg-stone-200 rounded-xl mt-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-24">
                                <p className="text-2xl font-semibold text-navy-900">
                                    No products found
                                </p>
                                <p className="text-stone-500 mt-2">
                                    Try adjusting your filters to see more results.
                                </p>
                                <button
                                    onClick={handleResetFilters}
                                    className="mt-6 px-6 py-3 rounded-xl bg-navy-900 text-white hover:bg-amber-500 transition"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                                {items.map(item => {
                                    const isWishlisted = wishlist.some(
                                        wish => wish.product._id === item._id
                                    )

                                    return (
                                        <div
                                            key={item._id}
                                            className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300"
                                        >

                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/uploads/items/${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-[340px] object-cover transition-transform duration-500 group-hover:scale-105"
                                                />

                                                <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                    -{item.discountPercentage}%
                                                </div>

                                                <button
                                                    onClick={
                                                        () => {
                                                            if (isWishlisted) {
                                                                toast(`${item.name} removed from your wishlist`, {
                                                                    icon: "🗑️",
                                                                    style: {
                                                                        background: "#ef4444",
                                                                        color: "#fff",
                                                                    },
                                                                });
                                                                removeFromWishlist(item._id);
                                                            } else {
                                                                toast.success(`${item.name} added to your Wishlist ❤️`)
                                                                addToWishlist(item._id);
                                                            }
                                                        }
                                                    }
                                                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                                                    {isWishlisted ? (
                                                        <Heart color="#ff0055" fill="red" size={18} />
                                                    ) : (
                                                        "♡"
                                                    )}
                                                </button>
                                            </div>

                                            <div className="p-4">
                                                <div className="text-xs uppercase tracking-wider text-stone-400 mb-1">
                                                    {item.category.name}
                                                </div>

                                                <Link to={`/product/${item._id}`}>
                                                    <h3 className="font-semibold text-lg text-navy-900 line-clamp-1 hover:text-yellow-400">
                                                        {item.name}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <span>⭐</span>

                                                    <span className="font-medium">
                                                        {item.rating}
                                                    </span>

                                                    <span className="text-sm text-stone-400">
                                                        ({item.numOfReviews})
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className="font-bold text-xl text-navy-900">
                                                        Rs. {item.discountedPrice}
                                                    </span>

                                                    <span className="text-stone-400 line-through">
                                                        Rs. {item.originalPrice}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (token) {
                                                            addToCart(item._id, 1);
                                                            toast.success(`${item.name} Added To Cart`);
                                                        } else {
                                                            toast.error("Please login to add items to cart.");
                                                            navigate("/login");
                                                        }
                                                    }}
                                                    disabled={item.stock === 0}
                                                    className={`w-full mt-4 py-3 rounded-xl font-medium transition
                                                ${item.stock
                                                            ? "bg-navy-900 text-white hover:bg-amber-500"
                                                            : "bg-stone-300 text-stone-500 cursor-not-allowed"
                                                        }`}
                                                >
                                                    {
                                                        item.stock
                                                            ? "Add to Cart"
                                                            : "Out of Stock"
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <Pagination />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shop;