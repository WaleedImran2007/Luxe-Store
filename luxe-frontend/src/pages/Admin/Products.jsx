import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api.js";

const Products = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/items");
            setProducts(res.data.items);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to delete this item?")) {
                return;
            }

            await api.delete(`/admin/delete-item/${id}`);

            setProducts(prevItems =>
                prevItems.filter(i => i._id !== id)
            );

            alert('Item Deleted Successfully');
        }

        catch (err) {
            console.error("Error deleting item:", err);
            alert("Failed to delete item.");
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        Products
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage all products in your store.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/add-item")}
                    className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Cards */}
                {isLoading ? (
                    <div className="grid gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-xl bg-gray-200 shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-5 w-1/2 bg-gray-200 rounded" />
                                        <div className="h-4 w-1/3 bg-gray-200 rounded" />
                                        <div className="h-4 w-1/4 bg-gray-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                <div className="grid gap-5">
                    {products.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-md p-4"
                        >
                            <div className="flex gap-4">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/items/${item.image}`}
                                    alt={item.name}
                                    className="w-24 h-24 rounded-xl object-cover"
                                />

                                <div className="flex-1">
                                    <h2 className="font-bold text-lg">
                                        {item.name}
                                    </h2>

                                    <p className="text-gray-500">
                                        {item.category.name}
                                    </p>

                                    <p className="mt-3 font-semibold">
                                        Rs. {item.discountedPrice.toLocaleString()}
                                    </p>

                                    <p className="text-gray-600">
                                        Stock : {item.stock}
                                    </p>

                                    <div className="mt-3">
                                        {item.stock === 0 ? (
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                                Out of Stock
                                            </span>
                                        ) : item.stock <= 5 ? (
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                In Stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-5 border-t pt-4">
                                <button
                                    onClick={() => navigate(`/admin/add-item?id=${item._id}`)} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                                    <Pencil size={18} />
                                    Edit
                                </button>

                                <button
                                    onClick={
                                        () => handleDelete(item._id)
                                    }
                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                )}

                {/* Empty State */}
                {!isLoading && products.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-lg text-center py-16 text-gray-500">
                        No products found.
                    </div>
                )}

            </div>

        </div>
    );
};

export default Products;