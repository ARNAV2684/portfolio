import { ISTClock } from "./ISTClock";

/** Footer (CLAUDE.md §5): copyright + live IST clock + build credit. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col items-start justify-between gap-3 py-8 sm:flex-row sm:items-center">
        <div className="font-mono-label text-mut">
          © 2026 Arnav Gupta · Mumbai, IN
        </div>
        <div className="flex items-center gap-2.5 font-mono-label text-mut">
          <ISTClock />
          <span aria-hidden>·</span>
          <span>built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
