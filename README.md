## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 18** + **TypeScript** - UI library with type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a service (auth, database, storage)
- **HTML5 Canvas** - Interactive space background

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the Supabase project URL, publishable
key, and secret key (from Supabase dashboard → Settings → API). See `.env.example` for
the full list and notes on which variables differ between dev and prod.

## Deploying

One Vercel project, two Supabase projects behind it:

- `main` branch → Production build → prod Supabase project
- `development` branch → Preview build on a stable staging URL → dev Supabase project

Flow: open a feature branch → PR into `development` → verify on the staging URL → PR
`development` into `main` → production. Environment variables are set per-environment in
the Vercel project settings, not globally — see `.env.example` for which ones differ.
