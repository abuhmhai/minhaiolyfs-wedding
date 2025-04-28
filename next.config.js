/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "localhost",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "minhaiolyfs-wedding-qzta-csj2r4iz2-abuhmhais-projects.vercel.app"
      ],
    },
    webpackBuildWorker: true,
  },
  async rewrites() {
    return [
      {
        source: '/payment/success',
        destination: '/payment/success',
      },
      {
        source: '/api/payment/momo/webhook',
        destination: '/api/payment/momo/webhook',
      }
    ];
  }
};

module.exports = nextConfig;
