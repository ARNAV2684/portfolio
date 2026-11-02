import type { ReactNode } from "react";
import { ScrollFill } from "./ScrollFill";

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
      <h2 className="mt-2 text-3xl md:text-[2.4rem]"><ScrollFill>{title}</ScrollFill></h2>
    </div>
  );
}
