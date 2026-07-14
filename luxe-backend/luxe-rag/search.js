import Knowledge from "../models/Knowledge.js";

import { createEmbeddings } from './embedder.js';
// import { cosineSimilarity } from "./similarity.js";

export async function searchKnowledge(question) {
    const questionEmbeddings = await createEmbeddings(question);

    return await Knowledge.aggregate([
        {
            $vectorSearch: {
                index: 'embedding_index',
                path: 'embeddings',
                queryVector: questionEmbeddings,
                numCandidates: 100,
                limit: 3,
            }
        },

        {
            $project: {
                document: 1,
                title: 1,
                text: 1,
                chunkIndex: 1
            }
        }
    ]);
}