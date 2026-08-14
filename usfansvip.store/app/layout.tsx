import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://usfansvip.store"),
  title: {
    default: "USFansVIP Store — USFans Spreadsheet Finds & Buyer Guides",
    template: "%s | USFansVIP Store",
  },
  description: "Browse USFans spreadsheet finds by category, open current products, and use practical QC, ordering and shipping guides before you buy.",
  keywords: ["USFans spreadsheet", "USFans finds", "USFans QC", "USFans guide", "W2C spreadsheet"],
  alternates: { canonical: "/" },
  openGraph: { title: "USFansVIP Store — The USFans Spreadsheet, Made Easier.", description: "An independent USFans spreadsheet directory with direct categories, fresh finds and practical buyer guides.", url: "https://usfansvip.store", siteName: "USFansVIP Store", type: "website" },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "128x128" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
