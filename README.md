# MovieVerse — Next.js (App Router)

Migrated from Vite + React to Next.js 15 with App Router.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy your environment variables into `.env.local` and fill in your actual values:

   ```
   NEXT_PUBLIC_TMDM_API_KEY=
   NEXT_PUBLIC_APPWRITE_ENDPOINT=
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=
   NEXT_PUBLIC_APPWRITE_DATABASE=
   NEXT_PUBLIC_APPWRITE_COLLECTION_ID=
   ```

3. Copy your public assets from the old project into the `public/` folder:
   - `BG.png`
   - `hero-bg.png`
   - `H4.png`
   - `search.svg`
   - `star.svg`

4. Run the dev server:
   ```bash
   npm run dev
   ```

## What Changed

| Old (Vite)               | New (Next.js)                               |
| ------------------------ | ------------------------------------------- |
| `main.jsx`               | `app/layout.jsx`                            |
| `App.jsx`                | `app/page.jsx`                              |
| `index.css`              | `app/globals.css`                           |
| `VITE_` env vars         | `NEXT_PUBLIC_` env vars                     |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*`                 |
| `./hero-img.png`         | `/hero-img.png` (served from `public/`)     |
| `spinner.jsx`            | `Spinner.jsx` (fixed `class` → `className`) |

## File Structure

```
movieverse-next/
├── app/
│   ├── layout.jsx        # Root layout with AuthProvider
│   ├── page.jsx          # Home page → renders MainApp
│   └── globals.css       # All your styles (unchanged)
├── components/
│   ├── MainApp.jsx       # Main app logic ('use client')
│   ├── AuthModal.jsx     # ('use client')
│   ├── UserMenu.jsx      # ('use client')
│   ├── MovieCard.jsx     # Pure display, no directive needed
│   ├── Search.jsx        # Pure display, no directive needed
│   └── Spinner.jsx       # Pure display, no directive needed
├── contexts/
│   └── AuthContext.jsx   # ('use client')
├── appwrite/
│   └── auth.js           # Appwrite auth service
├── appwrite.js           # Appwrite database helpers
└── public/               # ← copy your images/svgs here
```
