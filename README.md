# Metrix

Team analytics platform for engineering organizations. Track usage metrics, monitor activity, and surface performance insights across your team.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** NextAuth.js
- **Deployment:** Vercel

## Getting Started
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/           # Next.js App Router pages and layouts
│   ├── api/       # API route handlers
│   ├── dashboard/ # Dashboard pages
│   └── settings/  # Settings pages
├── components/    # Reusable React components
├── lib/           # Shared utilities, database, auth config
└── types/         # TypeScript type definitions
```

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/metrix
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run test` — Run test suite
- `npm run lint` — Run ESLint
- `npm run db:migrate` — Run database migrations
- `npm run db:seed` — Seed database with sample data
```
