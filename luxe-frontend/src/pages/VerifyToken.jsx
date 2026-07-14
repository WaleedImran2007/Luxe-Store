import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useEffect } from "react";
import axios from "axios";

const VerifyToken = () => {
    const { token } = useParams();
    console.log("VERIFICATION TOKEN:", token);
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`);
            }

            catch (err) {
                console.log(err);
                alert("Invalid or expired verification token");
                navigate('/login');
            }
        }

        verify();

    }, [token]);

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center px-5">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-10 text-center">

                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-5 rounded-full">
                        <CheckCircle 
                            size={70} 
                            className="text-green-600"
                        />
                    </div>
                </div>


                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Email Verified!
                </h1>


                <p className="text-gray-500 leading-relaxed mb-8">
                    Your account has been successfully verified.
                    You can now login and access the LUXE STORE.
                </p>


                <Link
                    to="/login"
                    className="
                        inline-block
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-semibold
                        px-8
                        py-3
                        rounded-lg
                        transition
                    "
                >
                    Go to Login
                </Link>


                <p className="text-sm text-gray-400 mt-8">
                    LUXE STORE &copy; {new Date().getFullYear()}. All rights reserved.
                </p>

            </div>

        </div>
    );
}

export default VerifyToken;