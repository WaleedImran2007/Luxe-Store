import Review from "../models/Review.js";
import Item from "../models/Item.js";

const updateProdRating = async (productID) => {
    const reviews = await Review.find({ product: productID });

    const numOfReviews = reviews.length;

    let rating = 0;

    if (numOfReviews > 0) {
        rating =
            reviews.reduce(
                (sum, review) => sum + review.rating,
                0
            ) / numOfReviews;
    }

    await Item.findByIdAndUpdate(productID, {
        rating,
        numOfReviews,
    })
}

export default updateProdRating;