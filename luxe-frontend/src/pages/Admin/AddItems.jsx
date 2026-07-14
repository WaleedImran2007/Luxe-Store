import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/api.js";
import toast from "react-hot-toast";

const AddItems = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const editID = query.get('id');

    const [form, setForm] = useState({
        name: "",
        description: "",
        originalPrice: "",
        discountedPrice: "",
        stock: "",
        category: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(Boolean(editID));

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        const fetchItem = async () => {
            try {
                const res = await api.get(`/items/${editID}`);
                const item = res.data;
                
                setForm({
                    name: item.name || "",
                    description: item.description || "",
                    originalPrice: item.originalPrice || "",
                    discountedPrice: item.discountedPrice || "",
                    stock: item.stock || "",
                    category: item.category?._id || item.category || "",
                });
                
                if (item.image) {
                    setPreview(`${import.meta.env.VITE_API_URL}/uploads/items/${item.image}`);
                }

            } catch (err) {
                console.error("Error fetching item details:", err);
                toast.error("Failed to load item data.");
            } finally {
                setIsFetching(false);
            }
        };

        fetchCategories();
        if (editID) {
            fetchItem();
        }
    }, [editID]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
        // Clear error as user types
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: null });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            if (errors.image) setErrors({ ...errors, image: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.originalPrice) newErrors.originalPrice = "Original price is required";
        if (!form.discountedPrice) newErrors.discountedPrice = "Discounted price is required";
        if (!form.stock) newErrors.stock = "Stock is required";
        if (!form.category || form.category === "Select Category") newErrors.category = "Category is required";
        if (!editID && !image) newErrors.image = "Image is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("originalPrice", form.originalPrice);
            formData.append("discountedPrice", form.discountedPrice);
            formData.append("stock", form.stock);
            formData.append("category", form.category);

            if (image) {
                formData.append("image", image);
            }

            if (editID) {
                await api.put(`/admin/update-item/${editID}`, formData);
                toast.success("Item Updated Successfully!");
            } else {
                await api.post('/admin/add-item', formData);
                toast.success("Item Added Successfully!");
            }

            navigate("/admin/products");
        } catch (err) {
            console.log(err);
            console.log(err.response?.data);
            toast.error("Something went wrong saving the item.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        {editID ? "Edit Item" : "Add New Item"}
                    </h1>
                    <p className="text-stone-500 mt-2">
                        {editID ? "Update the details of your product." : "Add a new product to your store inventory."}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">
                    {isFetching ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-11 w-full bg-stone-200 rounded-xl" />
                            <div className="h-24 w-full bg-stone-200 rounded-xl" />
                            <div className="h-11 w-full bg-stone-200 rounded-xl" />
                            <div className="h-11 w-full bg-stone-200 rounded-xl" />
                            <div className="h-72 w-full bg-stone-200 rounded-2xl" />
                        </div>
                    ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                value={form.name}
                                id="name"
                                onChange={handleChange}
                                placeholder="e.g. iPhone 16 Pro"
                                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-200 transition ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-amber-500'}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                            <textarea
                                rows="4"
                                placeholder="Write a short product description..."
                                id="description"
                                value={form.description}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border outline-none resize-none focus:ring-2 focus:ring-amber-200 transition ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-amber-500'}`}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Original Price</label>
                                <input
                                    type="number"
                                    placeholder="1000"
                                    id="originalPrice"
                                    value={form.originalPrice}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-200 transition ${errors.originalPrice ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-amber-500'}`}
                                />
                                {errors.originalPrice && <p className="text-red-500 text-xs mt-1">{errors.originalPrice}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Discounted Price</label>
                                <input
                                    type="number"
                                    placeholder="850"
                                    id="discountedPrice"
                                    value={form.discountedPrice}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-200 transition ${errors.discountedPrice ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-amber-500'}`}
                                />
                                {errors.discountedPrice && <p className="text-red-500 text-xs mt-1">{errors.discountedPrice}</p>}
                            </div>
                        </div>

                        {/* Category + Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                <select
                                    id="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-amber-200 transition ${errors.category ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-amber-500'}`}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Stock</label>
                                <input
                                    type="number"
                                    id="stock"
                                    placeholder="25"
                                    value={form.stock}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-200 transition ${errors.stock ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-amber-500'}`}
                                />
                                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                id="image"
                                onChange={handleImageChange}
                                className={`w-full rounded-xl border border-dashed p-3 cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white hover:file:bg-amber-500 ${errors.image ? 'border-red-500' : 'border-stone-300'}`}
                            />
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                        </div>

                        {/* Preview Placeholder */}
                        <div className="border-2 border-dashed border-stone-300 rounded-2xl h-72 flex items-center justify-center text-stone-400 overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span>Image Preview</span>
                            )}
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-amber-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? (editID ? "Updating..." : "Adding...")
                                : (editID ? "Update Item" : "Add Item")}
                        </button>
                    </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddItems;