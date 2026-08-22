import type { SkillItem } from "@/data/content";

/** Resolve a skill's icon URL: explicit override → Simple Icons slug → none. */
export function iconUrl(item: SkillItem): string | undefined {
  if (item.icon) return item.icon;
  if (item.slug) return `https://cdn.simpleicons.org/${item.slug}`;
  return undefined;
}
