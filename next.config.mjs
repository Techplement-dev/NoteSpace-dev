/** @type {import('next').NextConfig} */
const nextConfig = {
  // Speed up dev server
  reactStrictMode: false, // Disable for dev speed

  // Reduce webpack overhead
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
