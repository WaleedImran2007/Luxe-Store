import Category from "../../../models/Category.js";
import Item from "../../../models/Item.js";

export async function listCategories(context, step, user) {
    const categories = await Category.aggregate([
        {
            $lookup: {
                from: "items",
                localField: "_id",
                foreignField: "category",
                as: "products",
            }
        },

        {
            $project: {
                _id: 0,
                name: 1,
                products: products,
                totalProducts: {
                    $size: "$products"
                },
                inStock: {
                    $size: {
                        $filter: {
                            input: "$products",
                            as: "product",
                            cond: {
                                $gt: ["$$product.stock", 0]
                            }
                        }
                    }
                }
            }
        }
    ]);

    context.categories = categories;
    console.log(context.categories);
}