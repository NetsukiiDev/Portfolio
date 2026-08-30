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

Both the SQLite and MySQL Prisma clients are generated ahead of time into separate folders (`db:generate:sqlite` / `db:generate:mysql`, run automatically before `dev`/`build`), so switching database type — including through the setup wizard — takes effect immediately, with no process restart.

`npm run db:seed` seeds placeholder content (starter skill categories, default settings) — safe to re-run, and no longer touches the admin account, which is exclusively created through `/setup`.

## Cloudflare Tunnel

The site is self-hosted, and a tunnel is the least exposed way to put it online: `cloudflared` dials out to Cloudflare and traffic comes back down that connection, so the machine needs no open inbound port, no static IP and nothing forwarded on the router. Only loopback ever reaches the Next.js process.

[`cloudflared.example.yml`](cloudflared.example.yml) is a ready-to-fill config. The commands around it:

```bash
cloudflared tunnel login
cloudflared tunnel create portfolio
cloudflared tunnel route dns portfolio portfolio.example.com
```

Copy the example to `~/.cloudflared/config.yml`, fill in the tunnel name, the credentials file path printed by `create`, and your hostname. Then run it — in the foreground to check it works, as a service to keep it up:

```bash
cloudflared tunnel run portfolio
```

```bash
sudo cloudflared service install
```

Start the app the usual way (`npm run build && npm run start`); the tunnel points at `http://localhost:3000`.

**Set the domain to match.** Under `/admin/settings` → Generale, the domain and the HTTPS toggle are what canonical URLs, OG tags and `metadataBase` are built from. Set them to the tunnel hostname with HTTPS on. If you run `/setup` through the tunnel the wizard prefills both correctly; if you set the site up locally first, they'll still say `localhost:3000` until you change them.

**Complete the setup wizard before creating the DNS route.** Until setup finishes, every request lands on `/setup` — and whoever gets there first creates the admin account. Route the hostname only once the site is set up, or put the tunnel behind Cloudflare Access from the start.

**Consider Cloudflare Access on `/admin` and `/setup`.** A tunnel makes the admin panel internet-facing. A Zero Trust application covering `/admin*` and `/setup*`, restricted to your own email, adds a second gate in front of the password. Leave the rest of the site public.

### What the app does differently behind a proxy

Nothing needs configuring for this, but it's worth knowing:

- The hop from `cloudflared` to the app is plain HTTP even though the visitor is on HTTPS. The session cookie's `Secure` flag follows `X-Forwarded-Proto` rather than `NODE_ENV` ([`src/lib/forwarded.ts`](src/lib/forwarded.ts)), so it's set when the browser is actually on HTTPS — and isn't when you reach a production build over plain HTTP on the LAN, where a `Secure` cookie would silently break login.
- Redirects from [`src/proxy.ts`](src/proxy.ts) are emitted relative (`/admin/login`), so they can't leak the origin's host or scheme.
- Every request reaches the app from the `cloudflared` process on the same machine. There's no per-IP logic today; if you add any — rate limiting the contact form, say — read `CF-Connecting-IP`, not the socket address, or the whole internet counts as one client.
- To reach `npm run dev` (not `start`) through a tunnel, set `TUNNEL_HOSTNAME` to the hostname. Next.js otherwise blocks cross-origin requests to its dev assets; `next.config.ts` passes it through to `allowedDevOrigins`. Comma-separate several.

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
| `npm run db:generate:all` | Regenerate both Prisma clients (sqlite + mysql) after a schema change |
| `npm run db:use:sqlite` / `npm run db:use:mysql` | Switch the active `prisma/schema.prisma` |
