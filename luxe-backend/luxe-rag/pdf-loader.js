import { PDFParse } from 'pdf-parse';

export async function loadPDF(filepath) {
    const parser = new PDFParse({
        url: filepath
    });

    const result = await parser.getText();
    await parser.destroy();

    let text = result.text;

    // 1. REMOVE PAGE NUMBERS -- 1 of 3 --
    text = text.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '');

    // 2. Remove footer (handles potential spaces before the page number)
    text = text.replace(/LUXE Store Internal Knowledge Base\s*\d*/g, '');

    // 3. FIX: Replace multiple spaces/tabs with a SINGLE space ' ' (Not empty '')
    text = text.replace(/[ \t]+/g, ' ');

    // 4. Remove empty bullet lines
    text = text.replace(/^\s*•\s*$/gm, '');

    // 5. Clean up multiple newlines to keep it ready for your chunking function
    text = text.replace(/\n{2,}/g, "\n");
    
    // 6. Final trim of whitespace from start/end of document
    text = text.trim();

    return text;
}