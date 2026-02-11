import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Disable TypeScript and ESLint errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Increase body size limit for file uploads (default is 1MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
  webpack: (config) => {
    // Fix for PDF.js worker in Next.js
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    return config;
  },
};

export default nextConfig;
