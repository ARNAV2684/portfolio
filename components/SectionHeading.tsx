import type { ReactNode } from "react";

/** Shared section header: a mono caption above an 800-weight display heading. */
export function SectionHeading({
  caption,
  title,
}: {
  caption: ReactNode;
  title: string;
}) {
  return (
    <div>
      <div className="font-mono-label text-mut">{caption}</div>
      <h2 className="mt-2 text-3xl md:text-[2.4rem]">{title}</h2>
    </div>
  );
}
