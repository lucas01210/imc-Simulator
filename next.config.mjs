import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In this environment there may be multiple lockfiles above the repo root.
  // Explicitly pin Turbopack root so it uses this project.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

