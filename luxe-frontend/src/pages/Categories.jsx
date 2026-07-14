import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/categories`
            );
            
            setCategories(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openCategory = (id) => {
        navigate(`/shop?category=${id}`);
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] py-10 px-6">
            <div className="max-w-7xl mx-auto">

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-slate-900">
                        Shop by Category
                    </h1>

                    <p className="text-stone-500 mt-3">
                        Browse our collections and find what you're looking for.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                                <div className="w-full h-56 bg-stone-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 w-2/3 bg-stone-200 rounded" />
                                    <div className="h-4 w-full bg-stone-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center text-stone-500 py-20">
                        No categories available.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                onClick={() => openCategory(category._id)}
                                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/categories/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-56 object-cover"
                                />

                                <div className="p-5">
                                    <h2 className="text-xl font-semibold text-slate-800">
                                        {category.name}
                                    </h2>

                                    <p className="mt-2 text-sm text-stone-500 line-clamp-3">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;