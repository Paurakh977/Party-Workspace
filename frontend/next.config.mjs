/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  // Enable React strict mode for debugging issues more easily
  reactStrictMode: true,
  // Enable detailed error messages in development
  devIndicators: {
    buildActivity: true,
  },
  // Log errors and warnings in the console
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable detailed source maps for easier debugging
  productionBrowserSourceMaps: true,
};

export default nextConfig;
