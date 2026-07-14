import Item from '../../../models/Item.js';
import Review from '../../../models/Review.js';
import { findProduct } from './productService.js';

export async function getProductDetails(context, step, user) {
    const targetName =
        step.input?.name ||
        step ||
        context.productName

    console.log('Target Name in getProductDetails: ', targetName);

    const details = await findProduct(targetName);

    const comments = await Review.find({ product: details[0]._id }).select('comment');

    if (!details || details.length === 0) {
        context.directReply = `No Item found with the name "${targetName}".`;
        return;
    }

    context.productDetails = details.map(item => ({
        name: item.name,
        description: item.description,
        category: item.category.name,
        originalPrice: item.originalPrice,
        discountedPrice: item.discountedPrice,
        stock: item.stock,
        rating: item.rating,
        numOfReviews: item.numOfReviews,
        comments: comments
    }));
} 