/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/blocks',
        destination: 'https://blockdoku.vercel.app/',
      },
      {
        source: '/blocks/:path*',
        destination: 'https://blockdoku.vercel.app/:path*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/physics-labs/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
