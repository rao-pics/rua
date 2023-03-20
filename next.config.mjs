/**
 * @type {import('next').NextConfig}
 */

let { API_HOST } = process.env;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",

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
