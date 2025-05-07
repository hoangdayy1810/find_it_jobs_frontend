import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Các cấu hình khác nếu có
};

export default withNextIntl(nextConfig);
