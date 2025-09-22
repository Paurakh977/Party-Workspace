import type { Metadata } from "next";
import RootLayoutClient from "./Rootlayout";

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/kalimati.css";
import "@/css/style.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Nepali Congress Campaign",
    default: "Nepali Congress Campaign | Together for a Better Nepal",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
  themeColor: "#ffffff",
  description:
    "Official Nepali Congress Campaign App – stay updated with party news, events, campaigns, and join the movement for a stronger Nepal.",
  keywords: [
    "Nepali Congress",
    "Nepali Congress Campaign",
    "Nepal Politics",
    "Political Party Nepal",
    "NC Nepal",
    "Democracy Nepal",
    "Nepali Congress News",
    "Nepali Congress Events",
    "Nepali Congress Manifesto",
    "Nepali Politics",
  ],
  authors: [{ name: "Nepali Congress Digital Team" }],
  creator: "Nepali Congress",
  publisher: "Nepali Congress",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://devncca.encrafttech.com/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nepali Congress Campaign | Together for a Better Nepal",
    description:
      "Stay informed with official Nepali Congress news, events, and campaigns. Join us in building a democratic and prosperous Nepal.",
    url: "http://devncca.encrafttech.com/",
    siteName: "Nepali Congress Campaign",
    images: [
      {
        url: "/images/og-nc.jpg",
        width: 1200,
        height: 630,
        alt: "Nepali Congress Campaign Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepali Congress Campaign | Together for a Better Nepal",
    description:
      "Follow Nepali Congress Campaign updates, events, and official news directly from the party.",
    images: ["/images/twitter-nc.jpg"],
  },
  verification: {
    google: "google-site-verification-id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 antialiased dark:from-gray-950 dark:to-gray-900 dark:text-gray-100"
      >
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <RootLayoutClient>{children}</RootLayoutClient>
        </div>
      </body>
    </html>
  );
}
