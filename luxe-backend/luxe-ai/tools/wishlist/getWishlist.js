import Wishlist from "../../../models/Wishlist.js";
import { buildMongoFilters } from "../../helpers/buildMongoFilters.js";

export async function getWishlist(context, step, user) {
    const filters = buildMongoFilters(step.input?.filters);

    const wishlist = await Wishlist.findOne({
        user: user.userID,
        ...filters,
    }).populate('items.product');

    if (!wishlist || wishlist.items.length === 0) {
        context.cart = { items: [], total: 0 };
        return;
    }

    const items = wishlist.items
        .filter(item => item.product)
        .map(item => {
            return {
                name: item.product.name,
                price: item.product.discountedPrice,
            }
        });

    context.wishlist = {
        items,
    };

}