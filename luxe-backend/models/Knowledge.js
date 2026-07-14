import mongoose from 'mongoose';

const knowledgeSchema = new mongoose.Schema(
    {
        document: {
            type: String,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        chunkIndex: {
            type: String,
            required: true,
        },

        text: {
            type: String,
            required: true,
        },

        embeddings: {
            type: [Number],
            required: true,
        },

    },

    {
        timestamps: true,
    }
);

export default mongoose.model('Knowledge', knowledgeSchema);