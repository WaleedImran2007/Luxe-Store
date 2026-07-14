import { searchKnowledge } from "../../../luxe-rag/search.js";

export async function ragSearch(context, step) {
    const results = await searchKnowledge(step.input.text);
    console.log('In Search Knowledge: ', results);

    context.knowledge = results;
}