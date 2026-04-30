import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fullstackengineering.co"),
  title: {
    default: "Fullstack Engineering — Mechanical, Electrical & Software Design",
    template: "%s | Fullstack Engineering",
  },
  description:
    "Offshore mechanical, electrical, and software design for startups. Get production-ready engineering at 10x lower cost with fast turnaround. From concept to manufacturing — we handle it all.",
  keywords: [
    "offshore engineering",
    "mechanical design",
    "electrical design",
    "software development",
    "startup engineering",
    "product design",
    "CAD design",
    "PCB design",
    "firmware development",
    "embedded systems",
    "hardware engineering",
    "low cost engineering",
    "fast turnaround design",
    "contract engineering",
    "fullstack engineering",
  ],
  authors: [{ name: "Fullstack Engineering" }],
  creator: "Fullstack Engineering",
  publisher: "Fullstack Engineering",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: "Fullstack Engineering — 10x Lower Cost Engineering for Startups",
    description:
      "Offshore mechanical, electrical, and software design. Production-ready engineering with fast turnaround at a fraction of the cost.",
    type: "website",
    locale: "en_US",
    url: "https://fullstackengineering.co",
    siteName: "Fullstack Engineering",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fullstack Engineering — 10x Lower Cost Engineering for Startups",
    description:
      "Offshore mechanical, electrical, and software design for startups. Fast turnaround, production-ready results.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://fullstackengineering.co",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
