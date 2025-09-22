/** @type {import('next').NextConfig} */

import withPWAInit from "next-pwa";


const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});


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
      // Allow production backend/static asset hosts
      {
        protocol: "https",
        hostname: "devncca-be.encrafttech.com",
      },
      {
        protocol: "https",
        hostname: "devncca-be.encratf.com",
      },
      // Allow frontend domain in case absolute URLs are generated
      {
        protocol: "https",
        hostname: "devncca.encrafttech.com",
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
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // skip TS type checking during build
  },
  // Enable detailed source maps for easier debugging
  productionBrowserSourceMaps: true,
};

// export default nextConfig;
export default withPWA(nextConfig);
