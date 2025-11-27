# Website Translation Update

## Features
- **Multi-language Support**: Full website now supports English, Hindi, and Bengali.
- **Language Switcher**: Toggle languages instantly from the Navbar.

## Technical Changes
- **Translation System**: 
  - `lib/translations.ts`: Central dictionary for all static text.
  - `hooks/useTranslation.ts`: Custom hook to serve text based on selected language.
- **Database**: 
  - Added `title_hi`, `content_hi`, `title_bn`, `content_bn` columns to `cancer_docs` table.
- **Scripts**:
  - `scripts/push_translations.ts`: Pushes local translated content to Supabase.

## How to Run
1. **Dev Server**: `npm run dev`
2. **Sync Translations**: `npx tsx scripts/push_translations.ts` (Requires DB schema update first).