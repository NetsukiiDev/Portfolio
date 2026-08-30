import type { NextConfig } from "next";

// Reaching `next dev` through a tunnel means the requests arrive from a
// hostname the dev server wasn't started on, and Next blocks cross-origin
// requests to its dev assets. Listing the hostname here unblocks it; it has
// no effect on `next build`/`next start`.
const devOrigins = (process.env.TUNNEL_HOSTNAME ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  serverExternalPackages: ["mariadb"],
  ...(devOrigins.length > 0 && { allowedDevOrigins: devOrigins }),
};

export default nextConfig;
