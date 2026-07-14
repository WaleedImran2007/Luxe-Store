import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api.js";

const Categories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
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

    const handleEdit = async (id) => {
        navigate(`/admin/add-category?id=${id}`);
    }

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to delete this category?")) {
                return;
            }

            await api.delete(`/admin/delete-category/${id}`);

            setCategories(prevCategories => 
                prevCategories.filter(category => category._id !== id)
            )

            alert('Category Deleted Successfully');
        }

        catch (err) {
            console.error("Error deleting Category:", err);
            alert("Failed to delete Category.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Categories
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your product categories.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/add-category")}
                    className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto"
                >
                    <Plus size={20} />
                    Add Category
                </button>

            </div>

            {/* Mobile Cards */}

            {isLoading ? (
                <div className="grid gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-xl bg-stone-200 shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-1/2 bg-stone-200 rounded" />
                                    <div className="h-4 w-1/3 bg-stone-200 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (

            <div className="grid gap-5">

                {categories.map((category) => (

                    <div
                        key={category._id}
                        className="bg-white rounded-2xl shadow-md p-5"
                    >

                        <div className="flex gap-4">

                            <img
                                src={`${import.meta.env.VITE_API_URL}/uploads/categories/${category.image}`}
                                alt={category.name}
                                className="w-24 h-24 rounded-xl object-cover"
                            />

                            <div className="flex-1">

                                <h2 className="text-lg font-bold">
                                    {category.name}
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Products : {category.productsCount ?? 0}
                                </p>

                            </div>

                        </div>

                        <div className="border-t mt-5 pt-5 flex justify-end gap-3">

                            <button
                            onClick={() => handleEdit(category._id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                                <Pencil size={18} />
                                Edit
                            </button>

                            <button 
                            onClick={() => handleDelete(category._id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition">
                                <Trash2 size={18} />
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            )}

            {/* Empty State */}

            {!isLoading && categories.length === 0 && (

                <div className="bg-white rounded-2xl shadow-lg text-center py-16 mt-6">

                    <h2 className="text-2xl font-bold text-gray-700">
                        No Categories Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Create your first category to organize products.
                    </p>

                    <button
                        onClick={() => navigate("/admin/add-category")}
                        className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                        Add Category
                    </button>

                </div>

            )}

        </div>
    );
};

export default Categories;