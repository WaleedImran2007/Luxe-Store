import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from '../api/api.js';

export const CartContext = createContext({

});

function CartProvider({children}) {
    const { token } = useContext(AuthContext);

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!token) {
            setCart([]);
            return;
        }

        try {
            setLoading(true);
            const res = await api.get(`${import.meta.env.VITE_API_URL}/api/cart`);
            setCart(res.data.items || []);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCart();
    }, [token]);


    const addToCart = async (itemID, quantity) => {
        try {
            await api.post(`${import.meta.env.VITE_API_URL}/api/cart`, {itemID, quantity});
            await fetchCart();
        }

        catch (err) {
            console.log(err);
        }
    }

    const updateQuantity = async (itemID, quantity) => {
        try {
            await api.patch(`${import.meta.env.VITE_API_URL}/api/cart/${itemID}`, { quantity });
            
            setCart(prev =>
                prev.map(item => 
                    item.product._id === itemID ? {...item, quantity} : item
                )
            )
        }

        catch (err) {
            console.log(err);
        } 
    }

    const removeFromCart = async (productId) => {
        try {
            await api.delete(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`);
            
            await fetchCart();

        } catch (err) {
            console.log(err);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`);
            await fetchCart();

        } catch (err) {
            console.log(err);
        }

    };


    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )

}

export default CartProvider;