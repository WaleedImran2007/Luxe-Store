import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";

export default function Signup() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: '', email: '', password: '', confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setForm({ ...form, [e.target.id]: e.target.value });

        const newErrors = { ...errors };

        newErrors[e.target.id + 'Error'] = '';
        setErrors(newErrors);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        const { username, email, password, confirmPassword } = form;

        // USERNAME VALIDATION
        if (!username) newErrors.usernameError = 'Username is required';

        // EMAIL VALIDATION
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.emailError = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.emailError = 'Invalid Email';
        }

        // PASSWORD VALIDATION
        if (!password) {
            newErrors.passwordError = 'Password is required';
        } else if (password.length < 10) {
            newErrors.passwordError = 'Password should be at least 10 characters long';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one number';
        } else if (!/[a-z]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one lowercase letter';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            newErrors.passwordError = 'Password must contain at least one special character';
        }


        // 4. Confirm Password validation
        if (!confirmPassword) {
            newErrors.confirmPasswordError = 'Confirmation is required';
        } else if (password !== confirmPassword) {
            newErrors.confirmPasswordError = 'Password and Confirm Password do not match. Please try again.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newUser = ({
            username,
            email,
            password
        });

        // SAVE USER
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth`, newUser);

            if (res.status === 201) {
                setErrors({});
                toast.success("Account created Successfully! Check Your Email for Verification Link");
                navigate('/login');
            }
        }

        catch (err) {
            console.log(err);

            if (err.response?.status === 409) {
                const duplicateField = err.response.data.field;
                duplicateField === 'username' ? (
                    setErrors({ usernameError: 'Username Already Taken' }),
                    toast.error('Username Already Taken')
                ) : (
                    setErrors({ emailError: 'Email Already Registered' }),
                    toast.error('Email Already Registered')
                )
            }

            else if (err.response?.status === 403) {
                setErrors({
                    emailError: err.response.data.message
                });
            }

            else {
                toast.error('Server connection dropped. Please try again later.');
            }
        }

        finally {
            setLoading(false);
        }


    }


    return <>
        <section className="min-h-screen bg-stone-100 flex">

            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 relative">

                <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80"
                    alt="Luxury Fashion"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/50"></div>

                <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">

                    <h1 className="font-display text-6xl font-bold mb-6">
                        LUXE
                    </h1>

                    <p className="text-2xl leading-relaxed font-light">
                        Luxury is not a choice.
                        <br />
                        It's a lifestyle.
                    </p>

                </div>

            </div>

            {/* Right Side */}
            <div className="flex-1 flex items-center justify-center px-6 py-10">

                <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-stone-200 p-8">

                    <div className="text-center mb-8">
                        <h1 className="font-display text-4xl text-navy-900 font-bold">
                            Create Account
                        </h1>

                        <p className="text-stone-500 mt-2">
                            Join LUXE and discover timeless luxury.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Name */}

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="input-field"
                            />

                            {errors.usernameError && (
                                <span className="text-[12px] text-red-600 font-medium">
                                    {errors.usernameError}
                                </span>
                            )}
                        </div>

                        {/* Email */}

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="input-field"
                            />

                            {errors.emailError && (
                                <span className="text-[12px] text-red-600 font-medium">
                                    {errors.emailError}
                                </span>
                            )}
                        </div>

                        {/* Password */}

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input-field pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-navy-900"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>

                            {errors.passwordError && (
                                <span className="text-[12px] text-red-600 font-medium">
                                    {errors.passwordError}
                                </span>
                            )}
                        </div>

                        {/* Confirm Password */}

                        <div>
                            <label className="block text-sm font-medium text-navy-900 mb-2">
                                Confirm Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input-field pr-12"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-navy-900"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>

                            {errors.confirmPasswordError && (
                                <span className="text-[12px] text-red-600 font-medium">
                                    {errors.confirmPasswordError}
                                </span>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-md font-semibold transition disabled:opacity-60"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    <p className="text-center text-sm text-stone-500 mt-8">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-amber-500 font-semibold hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>

                </div>

            </div>

        </section>
    </>
}