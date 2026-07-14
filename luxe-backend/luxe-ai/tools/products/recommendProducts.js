import Item from "../../../models/Item.js";
import Category from "../../../models/Category.js";

import { buildMongoFilters } from "../../helpers/buildMongoFilters.js";

export async function recommendProducts(context, step, user) {
    const filters = {
        stock: { $gt: 0 },
        ...buildMongoFilters(step.filters)
    }

    if (step.input.category) {
        const category = await Category.findOne({
            name: {
                $regex: step.input.category,
                $options: "i"
            }
        });

        if (!category) {
            context.directReply = `I couldn't find the category "${step.input.category}".`;
            return;
        }

        filters.category = category._id;
    }



    const products = await Item.find(filters)
        .sort({ rating: -1 })
        .limit(5)
        .lean()

    
    context.recommendProducts = products; 

}