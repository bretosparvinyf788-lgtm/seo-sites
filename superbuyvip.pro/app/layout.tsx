import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://superbuyvip.pro"),
  title: "Superbuy Spreadsheet 2026 — Updated Finds & QC Notes",
  description: "Browse 10 curated Superbuy finds with prices and practical QC notes, plus 12 updated guides for shipping, fees, customs and warehouse checks.",
  alternates: { canonical: "https://superbuyvip.pro/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Superbuy Spreadsheet 2026 — Updated Finds & QC Notes",
    description: "Curated Superbuy finds, practical QC notes and 12 updated buyer guides for shipping, fees and warehouse decisions.",
    url: "https://superbuyvip.pro/",
    siteName: "SuperBuyVIP",
    type: "website",
    images: [{ url: "/products/product-01.webp", alt: "Superbuy Spreadsheet 2026 product research" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superbuy Spreadsheet 2026 — Updated Finds & QC Notes",
    description: "Curated finds, QC notes and independent Superbuy buyer guides.",
    images: ["/products/product-01.webp"],
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
