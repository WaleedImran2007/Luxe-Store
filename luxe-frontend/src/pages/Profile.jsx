import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/api.js";

const Profile = () => {
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [profileImage, setProfileImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    const [isFetching, setIsFetching] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfileImage(file);
        setProfilePreview(URL.createObjectURL(file));
    }

    const [form, setForm] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const toggleShowPassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(
                    `${import.meta.env.VITE_API_URL}/api/user/profile`
                );

                setForm({
                    username: res.data.username || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    address: res.data.address || '',
                    city: res.data.city || '',
                    postalCode: res.data.postalCode || '',
                    country: res.data.country || '',
                });

                setProfilePreview(
                    res.data.profileImage ? `${import.meta.env.VITE_API_URL}/uploads/pfp/${res.data.profileImage}` : null
                )

            } catch (err) {
                console.error(err);
            } finally {
                setIsFetching(false);
            }
        };

        fetchUser();
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        setProfileError('');
        setProfileSuccess('');

        try {
            setIsSavingProfile(true);

            const formData = new FormData();

            formData.append("username", form.username);
            formData.append("phone", form.phone);
            formData.append("address", form.address);
            formData.append("city", form.city);
            formData.append("postalCode", form.postalCode);
            formData.append("country", form.country);


            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const res = await api.put(
                `${import.meta.env.VITE_API_URL}/api/user/profile`,
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
            );

            setProfileSuccess(res.data.message);

        } catch (err) {
            console.log(err);

            setProfileError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        setPasswordError('');
        setPasswordSuccess('');

        try {
            setIsSavingPassword(true);

            const res = await api.put(
                `${import.meta.env.VITE_API_URL}/api/user/change-password`,
                passwords
            );

            setPasswordSuccess(res.data.message);

            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const passwordFields = [
        { name: 'currentPassword', label: 'Current Password' },
        { name: 'newPassword', label: 'New Password' },
        { name: 'confirmPassword', label: 'Confirm Password' },
    ];

    if (isFetching) {
        return (
            <div className="min-h-screen bg-stone-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-stone-300 border-t-amber-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative w-24 h-24 group">

                        <div className="w-full h-full rounded-full overflow-hidden bg-amber-500 flex items-center justify-center">

                            {profilePreview ? (
                                <img
                                    src={profilePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-4xl font-bold">
                                    {form.username
                                        ? form.username[0].toUpperCase()
                                        : "U"}
                                </span>
                            )}

                        </div>

                        {/* Hover Overlay */}
                        <label
                            htmlFor="profile-image"
                            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                        >
                            <span className="text-white text-sm font-medium">
                                Change
                            </span>
                        </label>

                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                    </div>

                    <h1 className="text-3xl font-bold text-stone-800 mt-4">
                        My Profile
                    </h1>

                    <p className="text-stone-500">
                        Manage your personal information
                    </p>
                </div>

                {/* Profile Form */}
                <form
                    onSubmit={handleProfileSubmit}
                    className="space-y-8"
                >
                    <div>
                        <h2 className="text-xl font-semibold text-stone-800 mb-5">
                            Personal Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>
                                <label className="block mb-2 font-medium">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={form.email}
                                    disabled
                                    className="w-full border rounded-lg px-4 py-2 bg-stone-100 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h2 className="text-xl font-semibold text-stone-800 mb-5">
                            Shipping Address
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <div className="md:col-span-2">
                                <label className="block mb-2 font-medium">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    name="postalCode"
                                    value={form.postalCode}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block mb-2 font-medium">
                                    Country
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>

                        </div>
                    </div>

                    {profileError && (
                        <p className="text-red-500 text-sm text-center">
                            {profileError}
                        </p>
                    )}

                    {profileSuccess && (
                        <p className="text-green-600 text-sm text-center">
                            {profileSuccess}
                        </p>
                    )}

                    <center>
                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSavingProfile ? "Saving..." : "Save Changes"}
                        </button>
                    </center>
                </form>

                {/* Divider */}
                <div className="border-t my-10"></div>

                {/* Change Password */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-6"
                >
                    <h2 className="text-xl font-semibold text-stone-800">
                        Change Password
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        {passwordFields.map(({ name, label }) => (
                            <div key={name}>
                                <label className="block mb-2 font-medium">
                                    {label}
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword[name] ? "text" : "password"}
                                        name={name}
                                        value={passwords[name]}
                                        onChange={handlePasswordChange}
                                        className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-amber-400 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => toggleShowPassword(name)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                                        tabIndex={-1}
                                    >
                                        {showPassword[name] ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>

                    {passwordError && (
                        <p className="text-red-500 text-sm text-center">
                            {passwordError}
                        </p>
                    )}

                    {passwordSuccess && (
                        <p className="text-green-600 text-sm text-center">
                            {passwordSuccess}
                        </p>
                    )}

                    <center>
                        <button
                            type="submit"
                            disabled={isSavingPassword}
                            className="bg-stone-800 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSavingPassword ? "Updating..." : "Update Password"}
                        </button>
                    </center>
                </form>

            </div>
        </div>
    );
};

export default Profile;