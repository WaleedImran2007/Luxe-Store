import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
    token: '',
    decodedUser: {},
    login: () => { },
    logout: () => { },
});

function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const decodedUser = token ? jwtDecode(token) : null;

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    }

    return <AuthContext.Provider
        value={{
            token,
            decodedUser,
            login,
            logout,
        }}>
        {children}
    </AuthContext.Provider>
}


export default AuthProvider;