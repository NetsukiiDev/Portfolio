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

The app runs `cloudflared` itself. Install the binary, then drive it from `/admin/settings` → **Tunnel**: pick the mode, press **Avvia**, and the panel shows the connection state, the public address and cloudflared's own log as it comes up. With "Avvia il tunnel insieme al sito" on, it starts with the server (`src/instrumentation.ts`), so a reboot doesn't quietly take the site off the internet.

```bash
winget install Cloudflare.cloudflared
```

If it's installed somewhere that isn't on `PATH`, put the full path in the panel's **Percorso di cloudflared** field.

### Two modes

**Tunnel del mio account (token)** — the one for a site meant to stay up. Create a tunnel in [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) → Networks → Tunnels, point its public hostname at `http://localhost:3000`, and copy the connector token into the panel. Routing and DNS stay in the dashboard; the app only needs the token, which is stored like any other secret — masked whenever it leaves the server, and stripped from the logs the panel shows.

**Tunnel rapido** — no account, no token. Cloudflare hands out a random `*.trycloudflare.com` address that lives as long as the process. Good for showing someone the site for ten minutes; not for anything permanent.

### Set the domain to match

Under `/admin/settings` → Generale, the domain and the HTTPS toggle are what canonical URLs, OG tags and `metadataBase` are built from. Set them to the tunnel hostname with HTTPS on. If you run `/setup` through the tunnel the wizard prefills both correctly; if you set the site up locally first, they'll still say `localhost:3000` until you change them.

### Before you route the DNS

**Finish the setup wizard first.** Until setup completes, every request lands on `/setup` — and whoever gets there first creates the admin account.

**Consider Cloudflare Access on `/admin` and `/setup`.** A tunnel makes the admin panel internet-facing, and the admin panel can now start and stop a tunnel and holds a token for your Cloudflare account. A Zero Trust application covering `/admin*` and `/setup*`, restricted to your own email, adds a second gate in front of the password.

### Running cloudflared yourself instead

If you'd rather keep the tunnel outside the app — as a system service that comes up before the site, say — leave the panel switched off and use [`cloudflared.example.yml`](cloudflared.example.yml):

```bash
cloudflared tunnel login
cloudflared tunnel create portfolio
cloudflared tunnel route dns portfolio portfolio.example.com
```

Copy the example to `~/.cloudflared/config.yml`, fill in the tunnel name, the credentials file path printed by `create`, and your hostname, then `sudo cloudflared service install`. Nothing in the app needs to know.

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
