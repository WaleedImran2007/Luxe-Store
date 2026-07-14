import Item from "../../../models/Item.js";

export async function searchProduct(context, step, user) {
    const query = step.input?.query;

    const products = await Item.find({
        $or: [
            {
                name: {
                    $regex: query,
                    $options: "i",
                }
            },

            {
                description: {
                    $regex: query,
                    $options: "i",
                }
            }
        ]
    });

    context.products = products;
}