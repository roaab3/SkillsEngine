/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  // Enable ES modules
  experimental: {
    appDir: false, // Use pages directory
  },
}

module.exports = nextConfig

