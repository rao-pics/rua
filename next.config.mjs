/**
 * @type {import('next').NextConfig}
 */
import ip from "ip";

let { API_HOST } = process.env;

if (API_HOST.includes("localhost") || API_HOST.includes("127.0.0.1")) {
  API_HOST = API_HOST.replace(/(localhost|127\.0\.0\.1)/, ip.address());
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

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
