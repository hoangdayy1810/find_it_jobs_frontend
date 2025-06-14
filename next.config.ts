import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Các cấu hình khác nếu có
  basePath: "",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    unoptimized: true, // Cần cho Static Site trên Render
  },
};

export default withNextIntl(nextConfig);
