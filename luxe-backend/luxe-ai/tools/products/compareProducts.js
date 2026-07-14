import Item from "../../../models/Item.js";
import { findProduct } from "./productService.js";

export async function compareProducts(context, step, user) {
    const names = step.input?.products;

    const comparison = [];

    for (const name of names) {
        const product = await Item.find({
            name: {
                $regex: name,
                $options: "i"
            }
        }).lean();

        if (product.length === 1) {
            comparison.push(product.map(item => ({
                name: item.name,
                description: item.description,
                category: item.category,
                originalPrice: item.originalPrice,
                discountedPrice: item.discountedPrice,
                stock: item.stock,
                rating: item.rating,
                numOfReviews: item.numOfReviews
            })));
        }

        
    }

    context.comparison = comparison;
}