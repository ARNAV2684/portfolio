// Prefixes NEXT_PUBLIC_BASE_PATH (set to "/portfolio" in GH Pages CI) so that
// plain <img>, <video>, and <a> tags resolve correctly under the subpath.
// Absolute URLs (https://...) are returned unchanged.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const assetPath = (path: string): string =>
  !path || path.startsWith("http") ? path : `${BASE}${path}`;
