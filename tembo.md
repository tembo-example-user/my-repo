# Tembo Rules — Metrix

## Tech Stack
- Next.js 14 with App Router (NOT Pages Router)
- TypeScript in strict mode
- Tailwind CSS for all styling — no CSS modules, no styled-components
- PostgreSQL with Drizzle ORM for database access
- NextAuth.js for authentication
- Zod for runtime validation on all API inputs
- Deployed on Vercel

## Coding Standards
- Use functional components with React hooks — no class components
- All API routes go in src/app/api/ using Next.js Route Handlers
- Use try/catch with custom error classes from src/lib/errors.ts
- Prefer named exports over default exports (except for page components)
- All database queries go through the repository pattern in src/lib/db/
- Never use `any` type — always define proper types in src/types/
- Use Zod schemas to validate all API request bodies

## File Conventions
- Components: PascalCase (e.g., MetricCard.tsx)
- Utilities: camelCase (e.g., formatDate.ts)
- API routes: lowercase with hyphens (e.g., /api/team-metrics)
- Types: PascalCase with .types.ts suffix (e.g., metrics.types.ts)

## Build & Test
- Build: `npm run build`
- Test: `npm run test`
- Lint: `npm run lint`
- Type check: `npx tsc --noEmit`
- Always run lint and type check before submitting a PR

## Architecture Notes
- Dashboard data is fetched server-side in page components, passed to client components as props
- All date/time values stored as UTC in the database, converted to user timezone on the client
- Rate limiting on all public API routes (see src/lib/rate-limit.ts)
- Background jobs use Vercel Cron (configured in vercel.json)

## Known Issues
- Auth session refresh has a race condition on cold starts (tracking in #47)
- Don't modify src/lib/legacy/ — scheduled for removal in v2.1
- The /api/export endpoint has a 30s timeout on large datasets — needs pagination
