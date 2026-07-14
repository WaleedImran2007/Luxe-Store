// PRODUCTS RELATED TOOLS
import { compareProducts } from "./products/compareProducts.js";
import { getProductDetails } from "./products/getProductDetails.js";
import { recommendProducts } from "./products/recommendProducts.js";
import { searchProduct } from "./products/searchProduct.js";

// CATEGORY RELATED TOOLS
import { listCategories } from "./categories/listCategories.js";

// CART RELATED TOOLS
import { getCart } from "./cart/getCart.js";
import { addToCart } from "./cart/addToCart.js";
import { removeFromCart } from "./cart/removeFromCart.js";

// WISHLIST RELATED TOOLS
import { getWishlist } from "./wishlist/getWishlist.js";
import { addToWishlist } from "./wishlist/addToWishlist.js";
import { clearWishlist } from "./wishlist/clearWishlist.js";
import { removeFromWishlist } from "./wishlist/removeFromWishlist.js";

// ORDER RELATED TOOLS
import { getMyOrders } from "./orders/getMyOrders.js";
import { getOrderStatus } from "./orders/getOrderStatus.js";
import { cancelOrder } from "./orders/cancelOrder.js";

// ADMIN RELATED TOOLS
import { getDashboardStatus } from "./admin/getDashboardStatus.js";
import { getRevenueReport } from "./admin/getRevenueReport.js";
import { searchUsers } from "./admin/searchUsers.js";
import { searchOrders } from "./admin/searchOrders.js";

// AI ASSISTANT RELATED TOOLS
import { ragSearch } from "./assistant/ragSearch.js";

// GENERAL CHAT TOOL
function generalChat(context, step, user) {
    context.generalChat = true;
}

export const toolsRegistry = {
    getProductDetails,
    compareProducts,
    recommendProducts,
    searchProduct,
    listCategories,
    getCart,
    addToCart,
    removeFromCart,
    getWishlist,
    addToWishlist,
    clearWishlist,
    removeFromWishlist,
    getMyOrders,
    getOrderStatus,
    cancelOrder,
    getDashboardStatus,
    getRevenueReport,
    searchUsers,
    searchOrders,
    ragSearch,

    generalChat,
}