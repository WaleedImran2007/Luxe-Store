import { useContext } from "react";
import { AuthContext } from '../../store/AuthContext.jsx';
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    if(!token) {
        return <Navigate to='/login' replace />
    }

    return children;
}

export default AuthRoute;