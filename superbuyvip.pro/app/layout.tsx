import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://superbuyvip.pro"),
  title: "SuperBuyVIP — Superbuy Spreadsheet 2026",
  description: "Independent Superbuy spreadsheet research with product discovery, QC checklists, parcel planning and fact-checked buyer guides.",
  alternates: { canonical: "https://superbuyvip.pro/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "SuperBuyVIP — Superbuy Spreadsheet 2026",
    description: "Find products, review QC evidence and plan a Superbuy parcel with clearer buyer research.",
    url: "https://superbuyvip.pro/",
    siteName: "SuperBuyVIP",
    type: "website",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-VD0JLQGX7K"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VD0JLQGX7K');`}
      </Script>
    </html>
  );
}
