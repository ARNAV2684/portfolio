import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { PersonJsonLd } from "@/components/PersonJsonLd";
import { StatCounter } from "@/components/StatCounter";
import { DATA } from "@/data/content";
import { IS_GH_PAGES_BUILD, SITE_URL } from "@/lib/seo";
import "./globals.css";

// Chivo Mono (the page's one family, Wayfind's material) is loaded via @import in
// globals.css; every colour and face comes from app/tokens.css.

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
    { media: "(prefers-color-scheme: light)", color: "#F0F2F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1017" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks returning visitors before first paint so the boot screen never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');try{if(sessionStorage.getItem('arnav-booted'))document.documentElement.dataset.booted='1'}catch(e){}",
          }}
        />
      </head>
      <body>
        <PersonJsonLd />
        <Providers>{children}</Providers>
        <StatCounter />
        {/* Hallmark slot script: swaps the owner's own files into [data-slot] frames and
            drops a stand-in that fails to load. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.hallmarkSlots=function(m){for(var k in m){var v=m[k],s=document.querySelector('[data-slot=\"'+k+'\"]');if(!s)continue;var im=new Image();im.src=typeof v==='string'?v:v.src;im.alt=(typeof v==='object'&&v.alt)||s.dataset.alt||'';s.querySelectorAll(':scope > img').forEach(function(o){o.remove()});s.prepend(im)}};document.querySelectorAll('[data-slot] img').forEach(function(i){if(i.complete&&!i.naturalWidth)i.remove();else i.addEventListener('error',function(){i.remove()},{once:true})});",
          }}
        />
      </body>
    </html>
  );
}
