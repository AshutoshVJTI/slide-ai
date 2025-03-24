/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to help with hydration errors
  reactStrictMode: false,
  
  // Configure external packages
  serverExternalPackages: ['pptxgenjs'],
  
  // Configure image domains with remotePatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      }
    ],
    // Add dangerouslyAllowSVG for potential SVG image support
    dangerouslyAllowSVG: true,
  },
  
  // ESLint configuration to ignore certain errors during build
  eslint: {
    // Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  
  // Webpack configuration for non-Turbopack environments
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      path: false 
    };
    return config;
  }
};

module.exports = nextConfig; 