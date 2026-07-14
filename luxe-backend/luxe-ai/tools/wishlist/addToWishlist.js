import Item from "../../../models/Item.js";
import Wishlist from "../../../models/Wishlist.js";

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function addToWishlist(context, step, user) {
    const targetName = step.input?.name?.trim();

    if (!targetName) {
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
        const productNames = products.map(p => `"${p.name}"`).join(', ');
        context.directReply = `I found multiple products. Which one do you mean? ${productNames}`;
        return;
    }

    const product = products[0];
    let wishlist = await Wishlist.findOne({
        user: user.userID,
    }).populate('items.product');

    if(!wishlist) {
         wishlist = new Wishlist({ user: user.userID, items: [] });
    }

    const existingItem = wishlist.items.find(item => 
        item.product._id.toString() === product._id.toString()
    )

    if(existingItem) {
        context.directReply = `${targetName} is already in your Wishlist`;
        return;
    }

    wishlist.items.push({ product: product._id });

    await wishlist.save();

    context.wishlist = {
        message: `Added "${product.name}" to your wishlist.`,
        product: product.name,
    };

}