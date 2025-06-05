/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/umami/script.js',
        destination: `https://eu.umami.is/script.js`,
      },
      {
        source: '/umami/api/send',
        destination: `https://eu.umami.is/api/send`,
      },
    ]
  },
  images: {
    domains: ['api.aibackend.cloud', 'localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.aibackend.cloud',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
  output: 'standalone',
}

module.exports = nextConfig