import type { MetadataRoute } from "next";
import { IS_GH_PAGES_BUILD, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // The GitHub Pages mirror serves identical content to arnav.works; keep it
  // out of search indexes entirely so it never competes with the primary
  // domain for ranking (see lib/seo.ts for the full rationale).
  if (IS_GH_PAGES_BUILD) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
