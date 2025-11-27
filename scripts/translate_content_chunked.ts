import { MOCK_ARTICLES } from '../lib/mockArticles';
import { translate } from 'google-translate-api-x';
import fs from 'fs';
import path from 'path';

// Helper to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to split text into chunks
function splitIntoChunks(text: string, maxLength: number = 2000): string[] {
    if (!text) return [];
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    let currentChunk = '';

    // Split by paragraphs first to preserve structure
    const paragraphs = text.split('\n\n');

    for (const para of paragraphs) {
        if ((currentChunk + '\n\n' + para).length > maxLength) {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = para;
        } else {
            currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
        }
    }
    if (currentChunk) chunks.push(currentChunk);

    return chunks;
}

async function translateText(text: string, to: string): Promise<string> {
    if (!text) return '';
    try {
        const chunks = splitIntoChunks(text);
        const translatedChunks = [];

        for (const chunk of chunks) {
            // Delay between chunks to be polite to the API
            await delay(1000);
            try {
                const res = await translate(chunk, { to });
                translatedChunks.push(res.text);
            } catch (chunkError) {
                console.error(`    Error translating chunk to ${to}:`, chunkError);
                translatedChunks.push(chunk); // Fallback to original chunk
            }
        }

        return translatedChunks.join('\n\n');
    } catch (error) {
        console.error(`Error translating text to ${to}:`, error);
        return text; // Return original if failed
    }
}

async function saveArticles(articles: any[]) {
    const content = `import { ArticleWithAvatar } from './docsRepository';

export const MOCK_ARTICLES: ArticleWithAvatar[] = ${JSON.stringify(articles, null, 2)};
`;
    const filePath = path.join(process.cwd(), 'lib', 'mockArticles.ts');
    fs.writeFileSync(filePath, content);
    console.log(`  Saved progress to ${filePath}`);
}

async function main() {
    console.log('Starting chunked translation...');

    // Clone the array
    const updatedArticles = JSON.parse(JSON.stringify(MOCK_ARTICLES));

    for (let i = 0; i < updatedArticles.length; i++) {
        const article = updatedArticles[i];
        console.log(`[${i + 1}/${updatedArticles.length}] Processing: ${article.title}`);
        let changed = false;

        // Hindi Content
        if (!article.content_hi || article.content_hi === article.content) {
            console.log('  Translating content to Hindi...');
            const translated = await translateText(article.content, 'hi');
            if (translated && translated !== article.content) {
                article.content_hi = translated;
                changed = true;
            }
        }

        // Bengali Content
        if (!article.content_bn || article.content_bn === article.content) {
            console.log('  Translating content to Bengali...');
            const translated = await translateText(article.content, 'bn');
            if (translated && translated !== article.content) {
                article.content_bn = translated;
                changed = true;
            }
        }

        // Ensure titles are also translated if missing
        if (!article.title_hi) {
            try {
                const res = await translate(article.title, { to: 'hi' });
                article.title_hi = res.text;
                changed = true;
            } catch (e) { }
        }
        if (!article.title_bn) {
            try {
                const res = await translate(article.title, { to: 'bn' });
                article.title_bn = res.text;
                changed = true;
            } catch (e) { }
        }

        // Save after every article if there were changes
        if (changed) {
            await saveArticles(updatedArticles);
        }
    }

    console.log('Translation complete.');
}

main().catch(console.error);
