import Wishlist from "../../../models/Wishlist.js";

export async function clearWishlist(context, step, user) {
    const wishlist = await Wishlist.findOne({ user: user.userID }).populate('items.product');

    if(!wishlist || !wishlist.items) {
        context.directReply = 'Your wishlist is already empty';
        return;
    }

    wishlist.items = [];

    await wishlist.save();

    context.wishlist = {
        message: 'Successfully Cleared your wishlist'
    }

}