# Carcino Fighters Website

A Next.js-based platform dedicated to providing comprehensive information and support for cancer fighters. This repository contains the source code for the frontend application, including multi-language support and dynamic content management.

## Features

-   **Internationalization (i18n)**: Native support for English, Hindi, and Bengali.
-   **Dynamic Content**: Article content is fetched dynamically, supporting localized titles and bodies.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS and Framer Motion.
-   **3D Visualizations**: Integrated 3D elements using Three.js / React Three Fiber.

## Architecture

### Translation System
The application utilizes a hybrid translation approach:
-   **Static UI Elements**: Managed via a centralized dictionary in `lib/translations.ts` and consumed through the `useTranslation` hook.
-   **Dynamic Content**: Stored in Supabase with localized columns (`title_hi`, `content_hi`, etc.) and fetched at runtime.

### Database Schema
The `cancer_docs` table has been extended to support localization. Ensure your Supabase instance includes the following schema updates:

```sql
ALTER TABLE cancer_docs 
ADD COLUMN IF NOT EXISTS title_hi TEXT,
ADD COLUMN IF NOT EXISTS content_hi TEXT,
ADD COLUMN IF NOT EXISTS title_bn TEXT,
ADD COLUMN IF NOT EXISTS content_bn TEXT;
```

## Development

### Prerequisites
-   Node.js 18+
-   Supabase project credentials

### Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env.local` file with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

### Scripts

-   **Sync Translations**: Pushes local translation data to the Supabase database.
    ```bash
    npx tsx scripts/push_translations.ts
    ```