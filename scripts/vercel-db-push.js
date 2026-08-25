// Runs `prisma db push` during the Vercel build, but never lets it fail the
// build: DATABASE_URL might not be set yet (first deploy, filled in later
// from the /setup wizard), or it might be set but the target database is
// temporarily unreachable (firewall, downtime, wrong credentials). Either
// way the site must still deploy — the app already degrades gracefully to
// the setup wizard / a "Verifica connessione" retry when the schema isn't
// there yet, so a stuck database should never block a deployment.
const { execSync } = require("child_process");

if (!process.env.DATABASE_URL) {
  console.log(
    "[vercel-build] DATABASE_URL is not set — skipping `prisma db push`. " +
      "Finish the Database step at /setup after this deploy, paste the shown values into " +
      "Vercel's Environment Variables, then redeploy to sync the schema.",
  );
  process.exit(0);
}

try {
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
} catch {
  console.log(
    "[vercel-build] `prisma db push` failed — the database at DATABASE_URL is set but not reachable " +
      "or not accepting the schema right now. Continuing the build anyway so the site still deploys; " +
      "fix the database and redeploy (or wait for the next deploy) to sync the schema.",
  );
}
