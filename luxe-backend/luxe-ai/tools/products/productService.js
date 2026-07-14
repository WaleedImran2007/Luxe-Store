import Item from "../../../models/Item.js";

export async function findProduct(name) {
    return await Item.find({
        name: {
            $regex: name,
            $options: "i",
        },
    }).lean();
}