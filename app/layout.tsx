import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dessert-near-me.vercel.app"),
  title: "Dessert Near Me - Find Sweet Treats",
  description: "Type a dessert and find nearby places that likely have it.",
  openGraph: {
    title: "Dessert Near Me - Find Sweet Treats",
    description: "Type a dessert and find nearby places that likely have it.",
    url: "https://dessert-near-me.vercel.app",
    siteName: "Dessert Near Me",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dessert Near Me - Find Sweet Treats",
    description: "Type a dessert and find nearby places that likely have it.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <CSPostHogProvider>
        <body className="min-h-full flex flex-col">{children}</body>
      </CSPostHogProvider>
    </html>
  );
}
