/**
 * Single source of truth for the canonical identity of this site. The same
 * codebase deploys to two places — arnav.works (Vercel, primary) and
 * arnav2684.github.io/portfolio (GitHub Pages, secondary/static mirror).
 * Search engines penalize identical content served from two indexable
 * domains, so the GitHub Pages build is deliberately marked noindex and
 * every canonical/OG/JSON-LD URL always points at arnav.works — regardless
 * of which domain is actually serving the page. See layout.tsx / robots.ts.
 */
export const SITE_URL = "https://arnav.works";
export const SITE_NAME = "Arnav Gupta";

/** True only inside the GitHub Pages Actions build (see .github/workflows/deploy-pages.yml). */
export const IS_GH_PAGES_BUILD = process.env.GITHUB_PAGES === "true";
