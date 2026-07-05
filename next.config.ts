import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle so the Docker image only needs
  // .next/standalone + .next/static + public (no node_modules).
  // Netlify's Next.js runtime expects the default build output, so disable
  // standalone there (Netlify sets NETLIFY=true during builds).
  output: process.env.NETLIFY ? undefined : "standalone",
};

export default nextConfig;
