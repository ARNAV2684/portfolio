/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Static export for GitHub Pages; Vercel handles the full runtime build normally.
  ...(isGithubPages && {
    output: "export",
    basePath: "/portfolio",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
