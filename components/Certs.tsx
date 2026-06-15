"use client";

import { useState } from "react";
import { DATA, type Cert } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const OCTAGON =
  "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";

/** Certifications grid (CLAUDE.md §5): octagon AWS badges, verified pill, verify link. */
export function Certs() {
  return (
    <section id="certs" className="shell scroll-mt-24 py-14 md:py-20">
      <Reveal>
        <SectionHeading caption="aws · verified credentials" title="Certifications" />
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {DATA.certs.map((c, i) => (
          <Reveal key={c.name} delay={i * 60}>
            <CertCard cert={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: Cert }) {
  return (
    <div className="shine card-hover flex items-center gap-4 rounded-card border border-line bg-card p-5">
      <BadgeOctagon cert={cert} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg">{cert.name}</h3>
          <span className="inline-flex items-center gap-1 rounded-full border border-green px-2 py-0.5 font-mono-label text-green">
            ✓ verified
          </span>
        </div>
        <div className="mt-1 font-mono-label text-mut">
          {cert.sub} · issued {cert.date}
        </div>
        {cert.verifyUrl ? (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-mono-label text-accent transition-opacity hover:opacity-70"
          >
            Verify credential ↗
          </a>
        ) : (
          <span className="mt-2 inline-block font-mono-label text-mut opacity-60">
            Verify credential ↗
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * AWS badge in an octagon frame tinted with the cert's ring color. If the badge
 * PNG is missing (placeholder asset), we fall back to the octagon + "AWS" mark
 * (CLAUDE.md §5). Uses a plain <img> so onError fallback works cleanly before
 * real assets land; swap to next/image once the PNGs are in /public/badges/.
 */
function BadgeOctagon({ cert }: { cert: Cert }) {
  const [errored, setErrored] = useState(false);

  // Fallback only: when the PNG is missing, show the octagon frame + "AWS" mark.
  if (errored) {
    return (
      <div className="relative h-20 w-20 shrink-0">
        <div
          className="absolute inset-0"
          style={{ clipPath: OCTAGON, background: cert.ring }}
          aria-hidden
        />
        <div
          className="absolute inset-[3px] grid place-items-center bg-card"
          style={{ clipPath: OCTAGON }}
        >
          <span
            className="font-display text-sm font-extrabold tracking-tight"
            style={{ color: cert.ring }}
            aria-label={`${cert.name} badge placeholder`}
          >
            AWS
          </span>
        </div>
      </div>
    );
  }

  // Real badge: let the polished hexagon graphic fill its box edge-to-edge.
  return (
    <div className="relative h-20 w-20 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetPath(cert.badgeImg)}
        alt={`${cert.name} (${cert.sub}) badge`}
        className="h-full w-full object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
