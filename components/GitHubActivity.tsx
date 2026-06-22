"use client";

import { useEffect, useState } from "react";

const GH_USER = "ARNAV2684";
const MAX_ITEMS = 5;

interface PushEvent {
  id: string;
  repo: string;
  message: string;
  url: string;
  when: Date;
}

interface RawCommit {
  message?: string;
  sha?: string;
}

interface RawEvent {
  id: string;
  type: string;
  repo?: { name: string };
  created_at: string;
  payload?: { commits?: RawCommit[] };
}

/** Relative time string — "2h ago", "yesterday", "3 days ago". */
function relativeTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

/**
 * Live GitHub activity band — fetches the user's public push events and shows
 * the most recent commits with repo + message + relative time. Falls back
 * silently if the API is unreachable or rate-limited (no error state on the page).
 */
export function GitHubActivity() {
  const [events, setEvents] = useState<PushEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=30`, {
      signal: ctrl.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((raw: RawEvent[]) => {
        const pushes: PushEvent[] = [];
        for (const ev of raw) {
          if (ev.type !== "PushEvent" || !ev.repo) continue;
          const commit = ev.payload?.commits?.[ev.payload.commits.length - 1];
          if (!commit?.message || !commit.sha) continue;
          pushes.push({
            id: ev.id,
            repo: ev.repo.name,
            message: commit.message.split("\n")[0]!.slice(0, 80),
            url: `https://github.com/${ev.repo.name}/commit/${commit.sha}`,
            when: new Date(ev.created_at),
          });
          if (pushes.length >= MAX_ITEMS) break;
        }
        setEvents(pushes);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => ctrl.abort();
  }, []);

  // Don't render anything until we know whether to show; avoids layout shift on
  // first paint when the API is fast (and a hard "loading" pulse when it isn't).
  if (!loaded) return null;
  if (events.length === 0) return null;

  return (
    <section
      aria-label="Recent GitHub activity"
      className="shell border-y border-line bg-card py-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center gap-2 font-mono-label text-mut">
          <span className="status-dot" aria-hidden />
          <span>recent commits</span>
          <a
            href={`https://github.com/${GH_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent transition-opacity hover:opacity-70"
          >
            @{GH_USER} ↗
          </a>
        </div>
        <ul className="flex flex-1 flex-wrap gap-x-5 gap-y-2 overflow-hidden">
          {events.map((e) => (
            <li key={e.id} className="flex min-w-0 items-baseline gap-2">
              <a
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-label text-ink transition-colors hover:text-accent"
                title={`${e.repo}: ${e.message}`}
              >
                <span className="text-accent">{e.repo.split("/")[1]}</span>
                <span className="text-mut"> · </span>
                <span className="truncate">{e.message}</span>
              </a>
              <span className="shrink-0 font-mono-label text-mut">{relativeTime(e.when)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
