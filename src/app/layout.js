import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../../public/custom-style.css";
import Providers from "@/store/Providers";
import AuthCookieSync from "@/components/AuthCookieSync";
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
  title: "PPrince Crypto - Secure Cryptocurrency Trading Platform",
  description: "Trade crypto securely with PPrince Crypto",
  icons: {
    icon: [
      { url: "/PP.png", type: "image/png", sizes: "32x32" },
      { url: "/PP.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/PP.png",
    apple: "/PP.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <AuthCookieSync />
          {children}
        </Providers>
      </body>
    </html>
  );
}
