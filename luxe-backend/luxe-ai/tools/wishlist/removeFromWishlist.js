import Wishlist from "../../../models/Wishlist.js";

export async function removeFromWishlist(context, step, user) {
    const targetName = step.input?.name?.trim();

    if (!targetName) {
        context.directReply = 'Please tell me which product you mean';
        return;
    }

    const wishlist = await Wishlist.findOne({ user: user.userID }).populate('items.product');

    if (!wishlist || wishlist.items.length === 0) {
        context.directReply = 'Your wishlist is already empty';
        return;
    }

    const matches = wishlist.items.filter(
        item => item.product?.name.toLowerCase().includes(targetName.toLowerCase())
    )

    if (matches.length === 0) {
        context.directReply = `No item matching "${targetName}" was found in your cart.`;
        return;
    }

    else if (matches.length > 1) {
        const productNames = matches.map(item => item.product?.name || 'Unknown Product').join("\n- ");

        context.directReply =
            `I found multiple matching items in your wishlist:\n- ${productNames}\n\nWhich one would you like to remove?`;
        return;
    }

    const productToRemove = matches[0].product;

    wishlist.items = wishlist.items.filter(item => 
        item.product._id.toString() !== itemToRemove._id.toString()
    )

    await wishlist.save();

    context.wishlistUpdate = {
        message: `Removed "${productToRemove.name}" from your wishlist.`,
    };


}