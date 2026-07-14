import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../api/api.js";
import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const AddCategory = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const editID = query.get("id");

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(Boolean(editID));

    useEffect(() => {
        const fetchCategory = async () => {
            if (!editID) return;

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/categories/${editID}`
                );

                const category = res.data;

                setForm({
                    name: category.name,
                    description: category.description,
                });

                if (category.image) {
                    setPreview(
                        `${import.meta.env.VITE_API_URL}/uploads/categories/${category.image}`
                    );
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchCategory();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.nameError = "Category name is required";
        }

        if (!form.description.trim()) {
            newErrors.descriptionError = "Description is required";
        }

        if (!editID && !image) {
            newErrors.imageError = "Category image is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("description", form.description);

            if (image) {
                formData.append("image", image);
            }

            if (editID) {
                await api.put(
                    `/admin/update-category/${editID}`,
                    formData
                );

                toast.success("Category updated successfully!");
            } else {
                await api.post(
                    `/admin/add-category`,
                    formData
                );

                toast.success("Category added successfully!");
            }

            navigate("/admin/categories");
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F5F1] p-6 md:p-10">
            <div className="max-w-xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        {editID ? "Edit Category" : "Add Category"}
                    </h1>

                    <p className="text-stone-500 mt-2">
                        Create a category for your store.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8">

                    {isFetching ? (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-11 w-full bg-stone-200 rounded-xl" />
                            <div className="h-24 w-full bg-stone-200 rounded-xl" />
                            <div className="h-44 w-full bg-stone-200 rounded-xl" />
                        </div>
                    ) : (

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="font-semibold text-slate-700">
                                Category Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Electronics"
                                className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-200 outline-none"
                            />

                            <p className="text-red-500 text-sm mt-1">
                                {errors.nameError}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold text-slate-700">
                                Description
                            </label>

                            <textarea
                                id="description"
                                rows="4"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Write a short description..."
                                className="w-full mt-2 px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-amber-200 outline-none"
                            />

                            <p className="text-red-500 text-sm mt-1">
                                {errors.descriptionError}
                            </p>
                        </div>

                        <div>
                            <label className="font-semibold text-slate-700">
                                Category Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full mt-2"
                            />

                            <p className="text-red-500 text-sm mt-1">
                                {errors.imageError}
                            </p>

                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mt-4 h-44 w-full object-cover rounded-xl border"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-amber-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? (editID ? "Updating..." : "Adding...")
                                : (editID ? "Update Category" : "Add Category")}
                        </button>

                    </form>

                    )}

                </div>
            </div>
        </div>
    );
};

export default AddCategory;