import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/templates/Header";
import Footer from "@/components/templates/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find IT Jobs - Nền tảng tìm việc ngành Công Nghệ Thông Tin",
  description:
    "Tìm kiếm việc làm IT nhanh chóng và hiệu quả tại Find IT Jobs. Nơi kết nối ứng viên công nghệ với các công ty hàng đầu Việt Nam. Nhiều cơ hội hấp dẫn, lương cao, môi trường chuyên nghiệp.",
  keywords:
    "find it jobs, việc làm IT, tuyển dụng IT, việc lập trình, developer jobs, IT jobs vietnam, công việc công nghệ, software engineer, backend, frontend, fullstack",
  robots: "INDEX,FOLLOW",
  appleWebApp: true,
  icons: [
    { rel: "icon", url: "/favicon.ico" }, // nên thêm icon riêng của bạn
    { rel: "shortcut icon", url: "/favicon.ico", type: "image/x-icon" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LocaleLayout locale={locale}>{children}</LocaleLayout>;
}

async function LocaleLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className="mdl-js">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8FAFC]`}
        // data-new-gr-c-s-check-loaded="14.1106.0"
        // data-gr-ext-installed=""
        // cz-shortcut-listen="true"
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProvider>
            <header>
              <Header />
            </header>

            <main className="bg-gray-100 text-black">{children}</main>

            <footer>
              <Footer />
            </footer>
            <Toaster position="top-right" />
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

const getMessages = async (locale: string) => {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return (await import(`../../messages/vi.json`)).default;
  }
};
