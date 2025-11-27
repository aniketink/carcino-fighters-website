import { MOCK_ARTICLES } from '../lib/mockArticles';
import { translate } from 'google-translate-api-x';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('Starting translation...');

    // Clone the array to avoid mutating the original import directly (though it's a reference)
    const updatedArticles = JSON.parse(JSON.stringify(MOCK_ARTICLES));

    for (const article of updatedArticles) {
        console.log(`Processing: ${article.title}`);

        // Hindi
        if (!article.title_hi) {
            try {
                console.log('  Translating title to Hindi...');
                const res = await translate(article.title, { to: 'hi' });
                article.title_hi = res.text;
            } catch (e) {
                console.error('  Failed to translate title to Hindi', e);
            }
        }

        if (!article.content_hi) {
            try {
                console.log('  Translating content to Hindi...');
                const res = await translate(article.content, { to: 'hi' });
                article.content_hi = res.text;
            } catch (e) {
                console.error('  Failed to translate content to Hindi', e);
            }
        }

        // Bengali
        if (!article.title_bn) {
            try {
                console.log('  Translating title to Bengali...');
                const res = await translate(article.title, { to: 'bn' });
                article.title_bn = res.text;
            } catch (e) {
                console.error('  Failed to translate title to Bengali', e);
            }
        }

        if (!article.content_bn) {
            try {
                console.log('  Translating content to Bengali...');
                const res = await translate(article.content, { to: 'bn' });
                article.content_bn = res.text;
            } catch (e) {
                console.error('  Failed to translate content to Bengali', e);
            }
        }
    }

    const content = `import { ArticleWithAvatar } from './docsRepository';

export const MOCK_ARTICLES: ArticleWithAvatar[] = ${JSON.stringify(updatedArticles, null, 2)};
`;

    const filePath = path.join(process.cwd(), 'lib', 'mockArticles.ts');
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
}

main().catch(console.error);
