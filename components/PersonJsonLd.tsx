import { DATA } from "@/data/content";
import { SITE_URL } from "@/lib/seo";

/**
 * schema.org Person structured data — the primary lever for entity
 * recognition by both classic search (Knowledge Panel eligibility) and
 * AI answer engines (ChatGPT/Perplexity/Google AI Overviews), which lean on
 * JSON-LD to extract "who is this, what do they do, where else do they
 * exist" as structured fact rather than parsed prose.
 *
 * Deliberately omits `worksFor`/`alumniOf` — no current employer or
 * education entry is rendered on the page itself, and structured data
 * should describe only what's actually visible, not unlisted claims.
 *
 * `image` is pinned to the SITE_URL origin (not run through assetPath's
 * basePath logic) — like `url`, it should always resolve to the canonical
 * arnav.works copy of the photo regardless of which domain serves this page.
 */
export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DATA.name,
    url: SITE_URL,
    image: `${SITE_URL}/arnav.jpg`,
    jobTitle: DATA.role,
    description: DATA.hero.sub,
    email: `mailto:${DATA.links.email}`,
    sameAs: [DATA.links.github, DATA.links.linkedin],
    knowsAbout: DATA.skills.flatMap((group) => group.items.map((item) => item.name)),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
