import { SearchX, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-6">

            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 text-center">

                <div className="w-28 h-28 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-8">
                    <SearchX
                        size={58}
                        className="text-indigo-600"
                    />
                </div>

                <h1 className="text-7xl font-extrabold text-indigo-600">
                    404
                </h1>

                <h2 className="text-3xl font-bold text-gray-800 mt-4">
                    Page Not Found
                </h2>

                <p className="mt-5 text-gray-500 leading-7 max-w-lg mx-auto">
                    The page you're looking for doesn't exist, may have been
                    moved, or the URL might be incorrect.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-semibold text-gray-700"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>

                </div>

                <div className="mt-12 border-t pt-6">
                    <p className="text-sm text-gray-400">
                        Error Code: <span className="font-semibold">404</span> •
                        The requested resource could not be found.
                    </p>
                </div>

            </div>

        </div>
    );
};

export default NotFound;