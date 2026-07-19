import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Always points at the canonical domain, even when this file is built as
// part of the GitHub Pages static export — that build's robots.ts disallows
// crawling entirely, so its own sitemap is moot (see lib/seo.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
