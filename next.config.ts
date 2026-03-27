import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for `next export` / static hosting.
  output: "export",
  // Allow LAN access during development (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: ["192.168.68.112"],
};

export default nextConfig;
