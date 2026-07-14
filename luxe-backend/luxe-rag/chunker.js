import { loadPDF } from "./pdf-loader.js";

export function createChunks(documentName, text) {
    // SPLIT BEFORE EACH NUMBERED HEADING
    const sections = text.split(/(?=^\d+\.\s)/m);

    const chunks = [];

    for (const section of sections) {
        // it will give:
        // 1. About LUXE STORE
        // it's answer

        let chunkText = section.trim();

        // skip empty text
        if(!chunkText) continue;

        // Skip anything before first numbered heading
        if(!/^\d+\.\s/.test(chunkText)) continue;

        // GET TITLE and it's text
        const firstLine = chunkText.split('\n')[0].trim();
        chunkText = chunkText.split('\n').slice(1).join("\n").trim();
        // chunkText = chunkText.split("\n").slice(1).join("\n").trim();

        const title = firstLine.replace(/^\d+\.\s*/,'');

        chunks.push({
            document: documentName,
            title,
            chunkIndex: chunks.length,
            text: chunkText,
        });
    }

    return chunks;
}