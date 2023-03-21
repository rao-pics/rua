/**
 * @type {import('next').NextConfig}
 */

let { API_HOST, ignoreBuildErrors = "true" } = process.env;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // 开发模式如果需要主题开发，可以设置为false
  // 配置DATABASE_URL
  // 执行 pnpm db:generate
  // 生成 types 类型文件
  typescript: {
    ignoreBuildErrors: ignoreBuildErrors === "true",
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
