export function isVercelRuntime(): boolean {
  return process.env.VERCEL === "1";
}
