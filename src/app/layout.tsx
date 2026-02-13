import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { siteName, siteDescription, siteUrl } from "@/constants/meta";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName,
    locale: "ja_JP",
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    images: [{ url: "/header.jpeg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-BK9Y08000M"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BK9Y08000M');
        `}
      </Script>
      <body
        className={`${notoSansJP.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <Header />
        <NavBar />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="mt-auto border-t border-stone-200 bg-stone-800 py-6 text-center">
          <Link
            href="/privacy-policy"
            className="text-xs text-stone-500 underline transition-colors hover:text-stone-300"
          >
            プライバシーポリシー
          </Link>
          <p className="mt-2 text-sm text-stone-400">
            &copy; {new Date().getFullYear()} {siteName}
          </p>
        </footer>
      </body>
    </html>
  );
}
