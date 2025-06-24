import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload main font, load mono on demand
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AI Automation Agency - SharpFlow",
  description: "Transform your business with custom AI automation solutions. We help businesses streamline operations, reduce costs, and boost productivity through intelligent automation.",
  keywords: "AI automation agency, custom automation, business automation, workflow optimization",
  authors: [{ name: "SharpFlow" }],
  robots: "index, follow",
  openGraph: {
    title: "AI Automation Marketplace",
    description: "Discover and download AI automation templates for your business",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//prod.spline.design" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="//prod.spline.design" />

        {/* Critical resource hints - fonts are handled by Next.js font optimization */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased performance-optimized`}
      >
        <PerformanceProvider>
          {children}
          <Toaster />
        </PerformanceProvider>

        {/* Secure Performance monitoring script */}
        <Script
          id="performance-observer"
          strategy="afterInteractive"
          src="/scripts/performance-monitor.js"
        />
      </body>
    </html>
  );
}
