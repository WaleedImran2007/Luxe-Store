import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    originalPrice: {
        type: Number,
        required: true,
        min: 0,
    },

    discountedPrice: {
        type: Number,
        required: true,
        min: 0,
    },

    discountPercentage: {
        type: Number,
        min: 0,
    },

    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },

    image: {
        type: String,
        default: "",
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    numOfReviews: {
        type: Number,
        default: 0,
        min: 0,
    }

}, {
    timestamps: true,
});

export default mongoose.model('Item', itemSchema);