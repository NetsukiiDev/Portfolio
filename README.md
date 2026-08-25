# Portfolio

A personal portfolio site with a JSON-i18n content model (English/Italian) and an admin CMS, built on Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, and Prisma.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Visit the site — on a fresh install you're sent straight to `/setup`, a 3-step wizard:

   1. **Database** — SQLite (default, one click) or MySQL/MariaDB (host/port/credentials, tested live before committing).
   2. **Account** — first name, last name, username, password. This is what you'll log in with at `/admin/login`.
   3. **Site** — domain, HTTPS, primary language, and a color theme (5 palettes × light/dark).

   The wizard writes `.env.local` itself (only ever `DATABASE_URL` and `JWT_SECRET`) and provisions the database — nothing to configure by hand. Once step 3 finishes, `/setup` locks itself and redirects to the site; visiting it again after that just bounces you home.

## Database

Content (projects, blog posts, skills, experience, AI gallery, settings) and the admin account live in a Prisma-managed SQL database — no flat JSON files, no secrets baked into `.env` beyond the connection string and JWT key.

**SQLite** is the default — a single file at `prisma/dev.db`, no server to run.

**MariaDB/MySQL** is also supported, either by picking it in the setup wizard (needs a reachable, empty database) or manually:

```bash
npm run db:use:mysql          # swaps prisma/schema.prisma for the MySQL variant
```

Then set `DATABASE_URL` in `.env.local` to a `mysql://user:password@host:port/database` connection string and run `npm run db:migrate`. `src/lib/prisma.ts` already picks the right driver adapter (`better-sqlite3` vs `mariadb`) based on the URL scheme — nothing to edit there.

To switch back: `npm run db:use:sqlite`.

Switching the database after the app has been running for a while (`next start` in production) requires a process restart to pick up the new `DATABASE_URL` — `next dev` does this automatically.

`npm run db:seed` seeds placeholder content (starter skill categories, default settings) — safe to re-run, and no longer touches the admin account, which is exclusively created through `/setup`.

## Admin

Log in at `/admin/login` with the username and password created during setup. From there you can manage every content type (projects, skills, experience, blog, AI gallery, settings) and your own account (`/admin/account` — profile and password).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm run start` | Production build / start |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create/update database tables from `prisma/schema.prisma` |
| `npm run db:seed` | Seeds placeholder settings/skills content (safe to re-run) |
| `npm run db:generate` | Regenerate the Prisma client after a schema change |
| `npm run db:use:sqlite` / `npm run db:use:mysql` | Switch the active `prisma/schema.prisma` |
