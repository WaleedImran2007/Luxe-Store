import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    rating: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5,
    },

    comment: {
        type: String,
        required: true,
        maxlength: 500,
        trim: true,
    }

}, {
    timestamps: true,
});

reviewSchema.index(
    {
        product: 1,
        user: 1,
    },
    {
        unique: true,
    }
);

export default mongoose.model('Review', reviewSchema);