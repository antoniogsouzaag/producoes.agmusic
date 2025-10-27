/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: standalone' - not compatible with Heroku buildpacks
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
