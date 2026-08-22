"use client";

import { useState } from "react";
import { DATA, type Cert } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const OCTAGON =
  "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)";

/**
 * Certifications rendered as a verification ledger — rows separated by
 * hairlines, not boxed cards. Deliberately different shape from every other
 * section: this reads like an audit log / manifest, not a "feature card."
 */
export function Certs() {
  return (
    <section id="certs" className="shell scroll-mt-24 py-14 md:py-20">
      <Reveal>
        <SectionHeading caption="aws · verified credentials" title="Certifications" />
      </Reveal>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {DATA.certs.map((c, i) => (
          <Reveal key={c.name} delay={i * 60}>
            <CertRow cert={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CertRow({ cert }: { cert: Cert }) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-5">
      <BadgeOctagon cert={cert} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg">{cert.name}</h3>
          <span className="inline-flex items-center gap-1 rounded-full border border-green px-2 py-0.5 font-mono-label text-green">
            ✓ verified
          </span>
        </div>
        <div className="mt-1 font-mono-label text-mut">
          {cert.sub} · issued {cert.date}
        </div>
      </div>

      {cert.verifyUrl ? (
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono-label text-accent transition-opacity hover:opacity-70"
        >
          Verify credential ↗
        </a>
      ) : (
        <span className="shrink-0 font-mono-label text-mut opacity-60">
          Verify credential ↗
        </span>
      )}
    </div>
  );
}

/**
 * AWS badge in an octagon frame tinted with the cert's ring color. If the badge
 * PNG is missing (placeholder asset), we fall back to the octagon + "AWS" mark.
 * Uses a plain <img> so onError fallback works cleanly before real assets land.
 */
function BadgeOctagon({ cert }: { cert: Cert }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="relative h-14 w-14 shrink-0">
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
            className="font-display text-xs font-extrabold tracking-tight"
            style={{ color: cert.ring }}
            aria-label={`${cert.name} badge placeholder`}
          >
            AWS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0">
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
