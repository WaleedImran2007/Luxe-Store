import mongoose from "mongoose";
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
dotenv.config();

import Knowledge from "../models/Knowledge.js";

import { loadPDF } from "./pdf-loader.js";
import { createChunks } from "./chunker.js";
import { createEmbeddings } from "./embedder.js";

await connectDB();

export async function ingest() {
    console.log('Loading PDF...');
    const text = await loadPDF('./data/luxe_store_knowledge_base.pdf');

    console.log('Creating Chunks...');
    const chunks = createChunks('LUXE STORE KNOWLEDE BASE', text);
    console.log(`Created ${chunks.length} Chunks.`);

    console.log('Deleting Old Knowledge...');
    await Knowledge.deleteMany({ document: 'LUXE STORE KNOWLEDE BASE' });

    console.log('Generating Embeddings...');

    for (const chunk of chunks) {
        const embeddings = await createEmbeddings(chunk.text);

        await Knowledge.create({
            ...chunk,
            embeddings,
        });

        console.log(`Stored: ${chunk.title}`);
    }

    console.log("Knowledge Base Created Successfully!");
}

await ingest();
mongoose.connection.close();