import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./providers";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { DATA } from "@/data/content";
import { IS_GH_PAGES_BUILD, SITE_URL } from "@/lib/seo";
import "./globals.css";

// Hanken Grotesque (display/body) is loaded via @import in globals.css; Geist Mono is
// self-hosted via the `geist` package. Both expose CSS vars consumed in tailwind.config.ts.

const TITLE = "Arnav Gupta — AI & MLOps Engineer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DATA.hero.sub,
  applicationName: "Arnav Gupta",
  authors: [{ name: "Arnav Gupta" }],
  creator: "Arnav Gupta",
  keywords: [
    "Arnav Gupta",
    "AI Engineer",
    "MLOps Engineer",
    "Machine Learning Engineer",
    "Computer Vision",
    "AWS Solutions Architect",
    "Docker",
    "Terraform",
    "Flickstat",
  ],
  // Always resolves to arnav.works via metadataBase, even when this page is
  // served from the GitHub Pages mirror — see lib/seo.ts.
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
  // The GitHub Pages mirror is intentionally excluded from search indexes —
  // it's a duplicate of arnav.works, not a separate page (see lib/seo.ts).
  robots: IS_GH_PAGES_BUILD
    ? { index: false, follow: false }
    : { index: true, follow: true },
  // Google Search Console — URL prefix property for arnav.works, HTML tag
  // method. (public/googleba15c9601844a912.html covers the HTML-file method
  // as a second, redundant verification path.)
  verification: {
    google: "jvd20LL987JtRpexQfUuBzTSSyQ_8yu8v0S9WQEFAGg",
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
        <PersonJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
