import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Debelu. — Shop your campus, chat-style",
    template: "%s | Debelu.",
  },
  description:
    "The marketplace for Nigerian students. Discover, chat, and buy from vendors on your campus.",
  keywords: [
    "campus marketplace",
    "Nigerian students",
    "university shopping",
    "student marketplace",
    "campus vendors",
    "UNILAG",
    "UNN",
    "OAU",
    "UI",
  ],
  authors: [{ name: "Debelu" }],
  creator: "Debelu",
  publisher: "Debelu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://debelu.ng"),
  openGraph: {
    title: "Debelu. — Shop your campus, chat-style",
    description:
      "The marketplace for Nigerian students. Discover, chat, and buy from vendors on your campus.",
    url: "https://debelu.ng",
    siteName: "Debelu",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debelu. — Shop your campus, chat-style",
    description:
      "The marketplace for Nigerian students. Discover, chat, and buy from vendors on your campus.",
    creator: "@debelu_ng",
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f10" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased text-foreground bg-background">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
