import Cart from "../../../models/Cart.js";

export async function removeFromCart(context, step, user) {
    const targetName = step.input?.name?.trim();

    if (!targetName) {
        context.directReply = 'Please tell me which product you mean';
        return;
    }

    const cart = await Cart.findOne({ user: user.userID }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        context.directReply = "Your cart is empty.";
        return;
    }

    const matches = cart.items.filter(
        item => item.product?.name.toLowerCase().includes(targetName.toLowerCase())
    )

    if (matches.length === 0) {
        context.directReply = `No item matching "${targetName}" was found in your cart.`;
        return;
    }

    else if (matches.length > 1) {
        const productNames = matches.map(item => item.product?.name || 'Unknown Product').join("\n- ");

        context.directReply =
            `I found multiple matching items in your cart:\n- ${productNames}\n\nWhich one would you like to remove?`;
        return;
    }

    const productToRemove = matches[0].product;

    cart.items = cart.items.filter(item => 
        item.product._id.toString() !== productToRemove._id.toString()
    );

    await cart.save();

    context.cartUpdate = {
        message: `Removed "${productToRemove.name}" from your cart.`,
    };
}