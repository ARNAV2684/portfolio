"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Sparkline } from "./Sparkline";

/**
 * One project opened as a case: its media on seven columns (the live site, the
 * demo clip or the screenshot), its facts on five, and the long-form case study
 * in a drawer under both. LIVE links to the site, OPEN SOURCE to the repo, and
 * PRIVATE lets the clip be the proof.
 */
export function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = `case-${project.title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <article className="grid12 case">
      <Media project={project} />

      <div className="case__body">
        <small>{project.kind}</small>
        <h3>
          {project.href ? (
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="case__desc">{project.desc}</p>

        {project.metric && (
          <div className="figs">
            {[project.metric, project.secondaryMetric].map(
              (m) =>
                m && (
                  <div key={m.label} className="fig">
                    <b>{m.value}</b>
                    <span>{m.label}</span>
                  </div>
                )
            )}
            {project.trend && <Sparkline points={project.trend.points} label={project.trend.label} />}
          </div>
        )}

        <ul className="tags" aria-label="Stack">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="case__actions">
          {project.href ? (
            <a href={project.href} target="_blank" rel="noopener noreferrer" className="textlink">
              {project.action.replace(/\s*↗$/, "")}
            </a>
          ) : (
            <small>{project.action.replace(/^▶\s*/, "")}</small>
          )}

          {project.caseStudy && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="btn btn--sm"
            >
              {open ? "Hide case study" : "Read case study"}
            </button>
          )}
        </div>
      </div>

      {project.caseStudy && (
        <div id={panelId} hidden={!open} className="drawer">
          <div>
            <h4>The challenge</h4>
            <p>{project.caseStudy.challenge}</p>
          </div>
          <div>
            <h4>My role</h4>
            <p>{project.caseStudy.role}</p>
          </div>
          <div className="drawer__wide">
            <h4>Process</h4>
            <ol>
              {project.caseStudy.process.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="drawer__wide">
            <h4>Result</h4>
            <p>{project.caseStudy.result}</p>
          </div>
        </div>
      )}
    </article>
  );
}

function Media({ project }: { project: Project }) {
  const { media } = project;

  if (media.kind === "live") {
    const host = project.href ? new URL(project.href).hostname.replace(/^www\./, "") : "";
    return (
      <figure className="case__media">
        <div className="case__frame">
          {media.src && (
            <iframe
              src={media.src}
              title={`${project.title} live preview`}
              loading="lazy"
              aria-hidden="true"
              tabIndex={-1}
            />
          )}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title} (opens in a new tab)`}
              className="case__visit"
            >
              <span>Visit {host}</span>
            </a>
          )}
        </div>
        <figcaption>The live site, {host}</figcaption>
      </figure>
    );
  }

  if (media.kind === "image") {
    return (
      <figure className="case__media">
        <div className="case__frame" data-slot="work-datapro" data-kind="product" data-alt={media.alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(media.src)} alt={media.alt} width={613} height={772} loading="lazy" />
        </div>
        <figcaption>{media.alt}</figcaption>
      </figure>
    );
  }

  return <VideoMedia project={project} src={assetPath(media.src)} poster={assetPath(media.poster)} />;
}

function VideoMedia({ project, src, poster }: { project: Project; src: string; poster: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  // Plays only while in view and not paused by the visitor; held still under reduced motion.
  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting && !paused) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced, paused]);

  const toggle = () => {
    const v = ref.current;
    const next = !paused;
    setPaused(next);
    if (!v) return;
    if (next) v.pause();
    else v.play().catch(() => {});
  };

  return (
    <figure className="case__media">
      <div className="case__frame" data-kind="product">
        <video ref={ref} muted loop playsInline preload="none" poster={poster || undefined} aria-label={`${project.title} demo clip`}>
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <figcaption className="case__cap">
        <span>{project.title}, demo clip</span>
        {!reduced && (
          <button type="button" className="btn btn--sm" onClick={toggle}>
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
