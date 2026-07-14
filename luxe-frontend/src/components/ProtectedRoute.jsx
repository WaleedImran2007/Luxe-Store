import { useContext } from "react"
import { AuthContext } from "../../store/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { token, decodedUser } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!decodedUser) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(decodedUser.role)) {
        return <Navigate to="/no-permission" replace />;
    }

    return children;
}

export default ProtectedRoute;