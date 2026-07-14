import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        

        messages: [
            {
                role: {
                    type: String,
                    enum: ['user', 'assistant'],
                    required: true,
                },

                content: {
                    type: String,
                    required: true,
                    trim: true,
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Chat', chatSchema);