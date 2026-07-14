import Cart from "../../../models/Cart.js";
import { buildMongoFilters } from "../../helpers/buildMongoFilters.js";

export async function getCart(context, step, user) {
    const filters = buildMongoFilters(step.input?.filters);

    const cart = await Cart.findOne({
        user: user.userID,
        ...filters,
    })
    .populate("items.product")
    .lean();

    if (!cart || cart.items.length === 0) {
        context.cart = { items: [], total: 0 };
        return;
    }

    const items = cart.items
        .filter(item => item.product)
        .map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.discountedPrice,
            subtotal: item.product.discountedPrice * item.quantity,
        }));

    context.cart = {
        items,
        total: items.reduce((sum, item) => sum + item.subtotal, 0),
    };
}
