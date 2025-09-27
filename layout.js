

// app/layout.tsx

import "./globals.css";
import { Aclonica, Kanit, Mulish } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAdsProvider } from "../lib/GoogleAdContext";
import { FacebookAdProvider } from "../lib/FacebookAdContext";
import { AdProvider } from "../lib/Allcontext";


import "./globals.css";


const unbounded = Aclonica({
  subsets: ["latin"],
  variable: "--font-aclonica",
  weight: ["400"],
});

const kanit = Mulish({
  subsets: ["latin"],
  variable: "--font-aclonica",
  weight: ["400"],
});

const siteConfig = {
  name: "Gobler - AI Ads assistant",
  description: "AI-powered chat and analysis platform for seamless interaction and information processing",
  keywords: ["AI", "chat", "analysis", "machine learning", "artificial intelligence"],
  authors: [{ name: " Team" }],
  creator: "",
  themeColor: "#22D3EE",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "AI Chat Platform",
    description: "AI-powered chat and analysis platform for seamless interaction and information processing",
    siteName: "NoBrainer",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chat Platform",
    description: "AI-powered chat and analysis platform for seamless interaction and information processing",
    creator: "@yourhandle",
  },
};

export default function RootLayout({ children }) {
  return (
  <ClerkProvider>
        <GoogleAdsProvider>
              <FacebookAdProvider>
                <AdProvider>
    <html lang="en">
      <head>
        <title>{siteConfig.name}</title>
      </head>
      <body className={kanit.className}>
     
          <div className="">
            {children}
          </div>
   
      </body>
    </html>
    </AdProvider>
    </FacebookAdProvider>
    </GoogleAdsProvider>
 </ClerkProvider>
  );
}