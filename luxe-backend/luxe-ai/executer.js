import { toolsRegistry } from "./tools/registry.js";
import Groq from "groq-sdk";

export async function executer(plan, user, originalMessage, history = []) {
    const context = {};

    for (const step of plan.plan) {
        const tool = toolsRegistry[step.tool];
        if (!tool) {
            console.warn(`Unknown tool in plan: ${step.tool}`);
            continue;
        }

        await tool(context, step, user);
    }

    const formattedHistory = history.map(msg => ({
        role: msg.role,
        content: msg.content,
    }));

    const answer = await synthesize(context, user, originalMessage, formattedHistory);

    return {
        answer,
        context,
    }
}

async function synthesize(context, user, originalMessage, history) {
    if (context.directReply) return context.directReply;

    // If a tool flagged a permission error, return that.
    if (context.error) return context.error;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemPrompt = `
        You are a helpful assistant for a LUXE ECOMMERCE STORE.

        Address the user by their first name when appropriate, especially in greetings.

        Be friendly, concise, and professional.

        Never invent data. Use only the information provided.

        Donot tell the user which tool is enable. For example: Hi user it seems general chat is enabled.

        If the user uses pronouns like "his", "her", "their" etc — resolve who they mean from conversation history.

        You will receive data collected from the database and your job is to answer
        the user's original question in a clear, professional, and concise way.
        Never make up data. Only use what is provided to you.
        If the data is empty, say so politely.
        Keep replies under 200 words unless a detailed report was requested.

        If multiple results found like
        Example: 
        User: Show me the report of Iphone
        Output:
        if There are multiple items found with this name. Choose one
        1. Iphone 15
        2. Iphone 15 pro max
        3. Iphone 16 
        etc
        Then let the user choose and then planner will give you the exact name

        But if only one item found then just answer him in the current conversation
        Example: 
        User: Show me the report of Iphone
        Output:
        if only one found.
        1. Iphone 15 pro max

        Just answer with it's details
        

    `;

    const userPrompt = `
        Original question: "${originalMessage}"

        Current User:
        Name: ${user.username}
        Role: ${user.role}

        Collected data:
        ${JSON.stringify(context, null, 2)}

        Answer the question using only the data above and history.
    `;

    console.log("History messages:", history.length);

    console.log(
        "History chars:",
        history.reduce((sum, msg) => sum + msg.content.length, 0)
    );

    console.log("User prompt chars:", userPrompt.length);
    console.log("System prompt chars:", systemPrompt.length);

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        messages: [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: userPrompt }
        ]
    });

    return completion.choices[0].message.content;
}