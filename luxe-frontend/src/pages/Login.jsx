import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../store/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        emailError: "",
        passwordError: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });

        const newErrors = { ...errors };
        newErrors[e.target.id + 'Error'] = '';

        setErrors(newErrors);

    };

    const handleSubmit = async (e) => {
        const { email, password } = form;
        e.preventDefault();

        let validationErrors = {};

        if (!form.email.trim()) {
            validationErrors.email = "Email is required";
        }

        if (!form.password.trim()) {
            validationErrors.password = "Password is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            // SAMPLE REQUEST
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );

            if (res.status === 200) {
                alert("Login successful!");
                login(res.data.token);
                setForm({
                    email: "",
                    password: "",
                })
            }

            alert("Login Successful!");

            navigate("/");

        } catch (err) {

            console.log(err);

            if (err.response?.status === 401) {
                console.log("SETTING ERROR");
                setErrors({ emailError: 'Invalid email or password' });
            }

            else if (err.response?.status === 403) {
                setErrors({ emailError: 'Please Verify Your Email First' });
            }

            else {
                alert("Server connection dropped.");
            }

        } finally {
            setLoading(false);
        }
    };

    return <>
        <section className="min-h-screen bg-stone-100 flex">

            {/* LEFT */}

            <div className="hidden lg:flex w-1/2 relative">

                <img
                    src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200"
                    alt=""
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/45"></div>

                <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">

                    <h1 className="text-6xl font-display font-bold mb-6">
                        LUXE
                    </h1>

                    <p className="text-2xl font-light leading-relaxed">
                        Timeless Fashion.
                        <br />
                        Premium Quality.
                        <br />
                        Luxury Experience.
                    </p>

                </div>

            </div>

            {/* RIGHT */}

            <div className="flex-1 flex items-center justify-center p-8">

                <div className="w-full max-w-md">

                    <h1 className="text-4xl font-display font-bold text-navy-900 mb-2">
                        Welcome Back
                    </h1>

                    <p className="text-stone-500 mb-8">
                        Sign in to continue shopping.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block mb-2 font-medium">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                value={form.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter your email"
                            />

                            {errors.emailError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.emailError}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="input-field pr-12"
                                    placeholder="Enter password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}

                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-md font-semibold transition disabled:opacity-60"
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}
                        </button>

                    </form>

                    <p className="text-center mt-8 text-stone-500">

                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="text-amber-500 font-semibold hover:underline"
                        >
                            Create Account
                        </Link>

                    </p>

                </div>

            </div>

        </section>
    </>
}