import Cart from "../../../models/Cart.js";
import Item from "../../../models/Item.js";

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function addToCart(context, step, user) {
    const targetName = step.input?.name;
    const quantity = Number(step.input?.quantity ?? 1);

    if (!targetName || !targetName.trim()) {
        context.directReply = 'Please tell me which product you mean';
        return;
    }

    const products = await Item.find({
        name: {
            $regex: escapeRegex(targetName),
            $options: "i",
        }
    }).lean();

    if (products.length === 0) {
        context.directReply = `No item found with name ${targetName}`;
        return;
    }

    else if (products.length > 1) {
        const productNames = products.map(p => `"${p.name}"`).join(', ')
        context.directReply = `I found multiple products. Which one do you mean? ${productNames}`;
        return;
    }

    const product = products[0];

    let cart = await Cart.findOne({ user: user.userID });

    if (!cart) {
        cart = new Cart({ user: user.userID, items: [] });
    }

    const existingItem = cart.items.find(
        item => item.product.toString() === product._id.toString()
    )

    if (quantity > 0) {
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: product._id, quantity });
        }
    }

    else {
        if (existingItem.quantity < (Math.abs(quantity))) {
            context.directReply = `You only have ${existingItem.quantity} of "${product.name}" in your cart.`;
            return;
        }

        existingItem.quantity += quantity;
    }


    await cart.save();

    const action = quantity > 0 ? "Added" : "Removed";

    context.cartUpdate = {
        message: `${action} ${Math.abs(quantity)} x "${product.name}" ${quantity > 0 ? "to" : "from"} your cart.`,
        product: product.name,
        quantity,
    };

}