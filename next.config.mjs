/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // We don't ship an ESLint config in this scaffold; type-checking still runs.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
