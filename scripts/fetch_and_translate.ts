import dotenv from 'dotenv';
import path from 'path';

// Load env vars before importing supabase
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { translate } from 'google-translate-api-x';
import fs from 'fs';

// Re-create supabase client here to ensure env vars are picked up
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    console.log('Fetching all articles from Supabase...');

    const { data: docs, error } = await supabase
        .from('cancer_docs')
        .select('id, slug, title, author, content, position')
        .order('title');

    if (error) {
        console.error('Error fetching docs:', error);
        return;
    }

    console.log(`Found ${docs.length} articles.`);

    const updatedArticles = [];

    for (const doc of docs) {
        console.log(`Processing: ${doc.title}`);
        const article = { ...doc, title_hi: null, content_hi: null, title_bn: null, content_bn: null };

        // Hindi
        try {
            // console.log('  Translating title to Hindi...');
            const resTitle = await translate(doc.title, { to: 'hi' });
            article.title_hi = resTitle.text;

            // console.log('  Translating content to Hindi...');
            // Truncate content if too long for free API or handle chunks? 
            // google-translate-api-x handles some length but let's be careful.
            // For now, just try the whole thing.
            const resContent = await translate(doc.content, { to: 'hi' });
            article.content_hi = resContent.text;
        } catch (e) {
            console.error('  Failed to translate to Hindi', e);
        }

        // Bengali
        try {
            // console.log('  Translating title to Bengali...');
            const resTitle = await translate(doc.title, { to: 'bn' });
            article.title_bn = resTitle.text;

            // console.log('  Translating content to Bengali...');
            const resContent = await translate(doc.content, { to: 'bn' });
            article.content_bn = resContent.text;
        } catch (e) {
            console.error('  Failed to translate to Bengali', e);
        }

        updatedArticles.push(article);
    }

    const content = `import { ArticleWithAvatar } from './docsRepository';

export const MOCK_ARTICLES: ArticleWithAvatar[] = ${JSON.stringify(updatedArticles, null, 2)};
`;

    const filePath = path.join(process.cwd(), 'lib', 'mockArticles.ts');
    fs.writeFileSync(filePath, content);
    console.log(`Successfully saved ${updatedArticles.length} translated articles to ${filePath}`);
}

main().catch(console.error);
