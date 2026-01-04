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

## Environment Variables

Make sure to set up the following environment variables in a `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)
