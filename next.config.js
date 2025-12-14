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
}

module.exports = nextConfig
