import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env vars before other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import data directly - relying on tsx to handle TypeScript and paths
import { MOCK_ARTICLES } from '@/lib/mockArticles';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncTranslations() {
    console.log(`Starting synchronization for ${MOCK_ARTICLES.length} articles...`);

    let successCount = 0;
    let failCount = 0;

    for (const article of MOCK_ARTICLES) {
        process.stdout.write(`Syncing "${article.title}"... `);

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
            console.log('FAILED');
            console.error(`  Error: ${error.message}`);
            failCount++;
        } else {
            console.log('OK');
            successCount++;
        }
    }

    console.log('\nSynchronization Complete.');
    console.log(`Success: ${successCount}`);
    console.log(`Failed:  ${failCount}`);
}

syncTranslations().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
