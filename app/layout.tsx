import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./providers";
import { DATA } from "@/data/content";
import "./globals.css";

// Hanken Grotesque (display/body) is loaded via @import in globals.css; Geist Mono is
// self-hosted via the `geist` package. Both expose CSS vars consumed in tailwind.config.ts.

// Canonical / OG base URL.
const SITE_URL = "https://arnav.works";
const TITLE = "Arnav Gupta — Cloud & DevOps Engineer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DATA.hero.sub,
  applicationName: "Arnav Gupta",
  authors: [{ name: "Arnav Gupta" }],
  creator: "Arnav Gupta",
  keywords: [
    "Arnav Gupta",
    "Cloud Engineer",
    "DevOps Engineer",
    "AWS Solutions Architect",
    "System Design",
    "Docker",
    "Terraform",
    "MLOps",
    "Next.js",
    "Flickstat",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DATA.hero.sub,
    url: SITE_URL,
    siteName: "Arnav Gupta",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DATA.hero.sub,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F1" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E10" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistMono.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
