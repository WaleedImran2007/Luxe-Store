import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NoPermission = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-6">

            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100">

                <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-8">
                    <ShieldX
                        size={52}
                        className="text-red-600"
                    />
                </div>

                <p className="text-red-600 font-semibold tracking-widest uppercase">
                    Error 403
                </p>

                <h1 className="text-4xl font-bold text-gray-800 mt-3">
                    Access Denied
                </h1>

                <p className="text-gray-500 mt-5 leading-7">
                    Sorry, you don't have permission to access this page.
                    If you believe this is a mistake, please contact an administrator.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-10">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
                    >
                        <Home size={18} />
                        Home
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default NoPermission;