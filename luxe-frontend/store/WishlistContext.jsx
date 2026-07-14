import { createContext, useState, useContext, useEffect } from "react";

import api from "../api/api.js";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext({

});


function WishlistProvider({ children }) {
    const { token } = useContext(AuthContext);

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);


    // GET ALL WISHLISTS
    const fetchWishlist = async () => {
        if (!token) {
            setWishlist([]);
            return;
        }

        try {
            setLoading(true);

            const res = await api.get(`${import.meta.env.VITE_API_URL}/api/wishlist`);

            setWishlist(res.data.items || []);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    // ADD TO WISHLIST
    const addToWishlist = async (itemID) => {
        await api.post(`/wishlist`, { itemID });

        await fetchWishlist();
    }

    // DELETE PRODUCT FROM WISHLIST
    const removeFromWishlist = async (itemID) => {
        await api.delete(`/wishlist/${itemID}`);

        const temp = wishlist.filter(item => item.product._id !== itemID);

        setWishlist(temp);
    }

    // DELETE WHOLE WISHLIST
    const clearWishlist = async () => {
        try {
            await api.delete(`wishlist/clear`);

            await fetchWishlist();

        } catch (err) {
            console.log(err);
        }

    };

    // CHECK THE PRODUCT IS WISHLISTED OR NOT
    const itemWishlisted = (itemID) => {
        return wishlist?.items?.find(item => item.product._id === itemID)
    }


    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                fetchWishlist,
                addToWishlist,
                removeFromWishlist,
                clearWishlist,
                itemWishlisted
            }}
        >
            {children}
        </WishlistContext.Provider>
    )


}


export default WishlistProvider;