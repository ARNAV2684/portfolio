/** Shared section head: the heading alone, at the section size. */
export function SectionHeading({ title }: { caption?: unknown; title: string }) {
  return (
    <div className="head">
      <h2>{title}</h2>
    </div>
  );
}
