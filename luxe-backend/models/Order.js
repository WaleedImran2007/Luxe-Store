import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true,
            },

            quantity: {
                type: Number,
                min: 1,
                required: true,
            },

            price: {
                type: Number,
                required: true,
            }
        }
    ],

    shippingAddress: {
        fullName: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        postalCode: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },
    },

    totalPrice: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },

    paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Card'],
        required: true,
    }
},
{
    timestamps: true,
});

export default mongoose.model('Order', orderSchema);