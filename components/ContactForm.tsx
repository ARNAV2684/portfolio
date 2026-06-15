"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { DATA } from "@/data/content";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_MESSAGE = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Contact form (CLAUDE.md §9): client validation, honeypot + timing, full submit path. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const mountedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim().slice(0, MAX_MESSAGE);

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          company: honeypot.current?.value ?? "", // honeypot (must stay empty)
          elapsedMs: Date.now() - mountedAt.current, // timing check
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-green bg-card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border-2 border-green text-xl text-green">
          ✓
        </div>
        <h3 className="mt-4 text-xl">Message sent.</h3>
        <p className="mt-2 text-mut">Thanks — I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 font-mono-label text-accent transition-opacity hover:opacity-70"
        >
          Send another ↺
        </button>
      </div>
    );
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-line bg-bg px-4 py-3 text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-[var(--accent-ring)]";
  const busy = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-card border border-line bg-card p-6 sm:p-7"
    >
      {/* Honeypot: off-screen, not display:none, so bots fill it but humans never see it. */}
      <input
        ref={honeypot}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
      />

      <div className="grid gap-4">
        <label className="block">
          <span className="font-mono-label text-mut">name</span>
          <input
            className={inputCls}
            type="text"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            autoComplete="name"
            required
            disabled={busy}
          />
        </label>

        <label className="block">
          <span className="font-mono-label text-mut">email</span>
          <input
            className={inputCls}
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            autoComplete="email"
            required
            disabled={busy}
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between font-mono-label text-mut">
            <span>message</span>
            <span>
              {values.message.length}/{MAX_MESSAGE}
            </span>
          </span>
          <textarea
            className={`${inputCls} resize-y`}
            rows={5}
            maxLength={MAX_MESSAGE}
            value={values.message}
            onChange={(e) =>
              setValues((v) => ({ ...v, message: e.target.value }))
            }
            required
            disabled={busy}
          />
        </label>
      </div>

      {status === "error" && error && (
        <p role="alert" className="mt-3 font-mono-label text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden
            />
            Sending…
          </>
        ) : (
          <>Send message</>
        )}
      </button>

      <p className="mt-3 text-center font-mono-label text-mut">
        or just email{" "}
        <a
          href={`mailto:${DATA.links.email}`}
          className="text-accent transition-opacity hover:opacity-70"
        >
          {DATA.links.email}
        </a>
      </p>
    </form>
  );
}
