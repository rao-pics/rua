/**
 * @type {import('next').NextConfig}
 */

const { API_HOST } = process.env;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    unoptimized: true,
  },

  output: "standalone",

  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },

  eslint: {
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },

  async redirects() {
    return [
      {
        source: "/api/:slug*",
        destination: `${API_HOST}/api/:slug*`,
        permanent: true,
      },
      {
        source: "/static/:slug*",
        destination: `${API_HOST}/static/:slug*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
