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
    domains: ['4.240.102.85', 'localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '4.240.102.85',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
  output: 'standalone',
}

module.exports = nextConfig