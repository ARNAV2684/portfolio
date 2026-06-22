"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useMouseGlow } from "@/lib/useMouseGlow";

// type badge colors (CLAUDE.md §7): LIVE→green, PRIVATE→accent, OPEN SOURCE→ink.
const TYPE_STYLES: Record<Project["type"], string> = {
  LIVE: "text-green border-green",
  PRIVATE: "text-accent border-accent",
  "OPEN SOURCE": "text-ink border-ink",
};

/**
 * Video-forward project card (CLAUDE.md §7): media panel (left ~300px) + info (right).
 * The taxonomy is the point — LIVE → live link, OPEN SOURCE → repo, PRIVATE → the clip
 * is the proof (rendered as a caption, no link).
 */
export function ProjectCard({ project }: { project: Project }) {
  const onMove = useMouseGlow();
  const [open, setOpen] = useState(false);
  const panelId = `case-${project.title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <article
      onMouseMove={onMove}
      className="card-hover glow overflow-hidden rounded-card border border-line bg-card"
    >
      <div className="grid md:grid-cols-[300px_1fr]">
        <Media project={project} />
        <div className="relative z-[1] flex flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="font-mono-label text-mut">{project.kind}</div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 font-mono-label ${
                TYPE_STYLES[project.type]
              }`}
            >
              {project.type}
            </span>
          </div>

          <h3 className="mt-2 text-2xl">{project.title}</h3>
          <p className="mt-3 max-w-[52ch] leading-relaxed text-mut">{project.desc}</p>

          {project.metric && (
            <div className="mt-4 inline-flex items-baseline gap-2 self-start rounded-lg border border-line bg-bg px-3 py-2">
              <span className="font-display text-xl font-extrabold tabular-nums text-accent">
                {project.metric.value}
              </span>
              <span className="font-mono-label text-mut">{project.metric.label}</span>
            </div>
          )}

          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-line px-2.5 py-1 font-mono-label text-mut"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-label text-accent transition-opacity hover:opacity-70"
              >
                {project.action}
              </a>
            ) : (
              <span className="font-mono-label text-mut">{project.action}</span>
            )}

            {project.caseStudy && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5 font-mono-label text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <span>{open ? "Hide case study" : "Read case study"}</span>
                <span
                  aria-hidden
                  className={`inline-block transition-transform ${open ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {project.caseStudy && (
        <CaseStudyDrawer panelId={panelId} open={open} caseStudy={project.caseStudy} />
      )}
    </article>
  );
}

function CaseStudyDrawer({
  panelId,
  open,
  caseStudy,
}: {
  panelId: string;
  open: boolean;
  caseStudy: NonNullable<Project["caseStudy"]>;
}) {
  return (
    <div
      id={panelId}
      hidden={!open}
      className={`relative z-[1] border-t border-line bg-bg/40 ${
        open ? "case-study-enter" : ""
      }`}
    >
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <Field label="The challenge" body={caseStudy.challenge} />
        <Field label="My role" body={caseStudy.role} />
        <div className="md:col-span-2">
          <div className="font-mono-label text-mut">// process</div>
          <ol className="mt-2 space-y-2">
            {caseStudy.process.map((step, i) => (
              <li key={i} className="flex gap-3 leading-relaxed text-ink">
                <span className="mt-0.5 inline-block min-w-6 font-mono-label text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:col-span-2">
          <div className="font-mono-label text-mut">// result</div>
          <p className="mt-2 leading-relaxed text-ink">{caseStudy.result}</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div className="font-mono-label text-mut">// {label}</div>
      <p className="mt-2 leading-relaxed text-ink">{body}</p>
    </div>
  );
}

function Media({ project }: { project: Project }) {
  const { media } = project;

  if (media.kind === "live") {
    return (
      <div className="live-tile relative z-[1] min-h-[200px] overflow-hidden md:min-h-full">
        {media.src && (
          <iframe
            src={media.src}
            title={`${project.title} live preview`}
            loading="lazy"
            aria-hidden="true"
            tabIndex={-1}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "calc(100% / 0.38)",
              height: "calc(100% / 0.38)",
              transform: "scale(0.38)",
              transformOrigin: "top left",
              pointerEvents: "none",
              border: "none",
            }}
          />
        )}
        <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-black/35 px-2.5 py-1 font-mono-label text-white/90 backdrop-blur">
          <span className="status-dot" aria-hidden />
          live · flickstat.com
        </span>
      </div>
    );
  }

  if (media.kind === "image") {
    return (
      <div className="relative z-[1] min-h-[200px] overflow-hidden md:min-h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath(media.src)}
          alt={media.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  return <VideoMedia project={project} src={assetPath(media.src)} poster={assetPath(media.poster)} />;
}

function VideoMedia({
  project,
  src,
  poster,
}: {
  project: Project;
  src: string;
  poster: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  // Lazy autoplay: only play while the card is in view; pause otherwise (CLAUDE.md §7).
  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className="media-fallback relative z-[1] min-h-[200px] overflow-hidden md:min-h-full">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster={poster || undefined}
        aria-label={`${project.title} demo clip`}
      >
        <source src={src} type="video/mp4" />
      </video>
      <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1 font-mono-label text-white/90 backdrop-blur">
        {reduced ? "▶ demo (reduced motion)" : "▶ auto-playing"}
      </span>
    </div>
  );
}
