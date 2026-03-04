import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../../public/custom-style.css";
import Providers from "@/store/Providers";
import AuthCookieSync from "@/components/AuthCookieSync";
import GlobalErrorListener from "@/components/GlobalErrorListener";
// Root layout keeps only global providers and styles. Shells are applied per route group.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Satorem - Crypto Trading Platform",
  description: "Modern cryptocurrency trading platform for secure and fast trading",
  icons: {
    icon: [
      { url: "/storm.png", type: "image/png", sizes: "32x32" },
      { url: "/storm.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/storm.png",
    apple: "/storm.png",
  },
};

import Toaster from "@/components/Toaster";
import LoaderOverlay from "@/components/LoaderOverlay";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Toaster />
          <LoaderOverlay />
          <GlobalErrorListener />
          <AuthCookieSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}
