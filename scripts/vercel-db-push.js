// Runs `prisma db push` during the Vercel build — but only if DATABASE_URL is
// already configured. On a first deploy it usually isn't yet (the user fills
// it in from the /setup wizard, then pastes it into Vercel's Environment
// Variables and redeploys), so this must not fail the build in that case.
const { execSync } = require("child_process");

if (!process.env.DATABASE_URL) {
  console.log(
    "[vercel-build] DATABASE_URL is not set — skipping `prisma db push`. " +
      "Finish the Database step at /setup after this deploy, paste the shown values into " +
      "Vercel's Environment Variables, then redeploy to sync the schema.",
  );
  process.exit(0);
}

execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
