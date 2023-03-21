/**
 * @type {import('next').NextConfig}
 */

let { API_HOST, NODE_ENV } = process.env;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",

  typescript: {
    ignoreBuildErrors: NODE_ENV === "production",
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

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
