import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
    const mockPath = path.join(process.cwd(), 'lib', 'mockArticles.ts');

    if (!fs.existsSync(mockPath)) {
        console.error('lib/mockArticles.ts not found');
        return;
    }

    console.log('Reading lib/mockArticles.ts...');
    const fileContent = fs.readFileSync(mockPath, 'utf-8');

    // Extract JSON array
    const start = fileContent.indexOf('[');
    const end = fileContent.lastIndexOf(']');

    if (start === -1 || end === -1) {
        console.error('Could not find JSON array in mockArticles.ts');
        return;
    }

    const jsonStr = fileContent.substring(start, end + 1);
    let articles;
    try {
        // Use eval to handle potential trailing commas or JS-specific syntax
        // eslint-disable-next-line no-eval
        articles = eval('(' + jsonStr + ')');
    } catch (e) {
        console.error('Failed to parse data from mockArticles.ts', e);
        console.log('First 100 chars:', jsonStr.substring(0, 100));
        return;
    }

    console.log(`Found ${articles.length} articles to sync.`);

    for (const article of articles) {
        console.log(`Updating: ${article.title}`);

        const { error } = await supabase
            .from('cancer_docs')
            .update({
                title_hi: article.title_hi,
                content_hi: article.content_hi,
                title_bn: article.title_bn,
                content_bn: article.content_bn
            })
            .eq('id', article.id);

        if (error) {
            console.error(`  Error updating article ${article.id}:`, error.message);
        } else {
            console.log(`  Success.`);
        }
    }

    console.log('Done.');
}

main().catch(console.error);
