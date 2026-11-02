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

/** Relative time string: "2h ago", "yesterday", "3d ago". */
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
 * Recent commits as status rows on a change of paper: the user's public push
 * events, newest first. Renders nothing if the API is unreachable or
 * rate-limited, so the page never shows an error band.
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

  if (!loaded) return null;
  if (events.length === 0) return null;

  return (
    <section aria-label="Recent GitHub activity" className="section--band">
      <div className="container grid12 commits">
        <div className="commits__head">
          <h2>Recent commits</h2>
          <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener noreferrer" className="textlink">
            @{GH_USER} on GitHub
          </a>
        </div>
        <ol className="commits__list">
          {events.map((e) => (
            <li key={e.id}>
              <a href={e.url} target="_blank" rel="noopener noreferrer" className="commit" title={`${e.repo}: ${e.message}`}>
                <span className="commit__repo">{e.repo.split("/")[1]}</span>
                <span className="commit__msg">{e.message}</span>
                <small>{relativeTime(e.when)}</small>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
