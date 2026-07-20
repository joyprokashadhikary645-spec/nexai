/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify deployment সাপোর্ট
  output: 'standalone',
  
  // ইমেজ অপটিমাইজেশন
  images: {
    domains: [
      'localhost',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'pbs.twimg.com',
    ],
    unoptimized: true, // Netlify এর জন্য
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Webpack কনফিগারেশন
  webpack: (config, { isServer }) => {
    return config;
  },

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/chat',
        permanent: false,
      },
    ];
  },

  // Rewrites
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
