/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@prisma/engines/**',
      'node_modules/@prisma/client/**',
      'node_modules/.prisma/**',
      'node_modules/prisma/**',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
}
module.exports = nextConfig