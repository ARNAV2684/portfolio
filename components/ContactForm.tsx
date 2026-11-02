"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_MESSAGE = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Contact form: client validation, honeypot and timing check, posts to /api/contact (Resend). */
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
      <div className="sent" role="status">
        <h3>Message sent.</h3>
        <p>Thanks, I’ll get back to you soon.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn--sm">
          Send another
        </button>
      </div>
    );
  }

  const busy = status === "submitting";
  const invalid = status === "error" && Boolean(error);

  return (
    <form onSubmit={onSubmit} noValidate className="form" style={{ position: "relative" }}>
      {/* Honeypot: off-screen, not display:none, so bots fill it but people never see it. */}
      <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="honeypot" />

      <label className="field">
        <span className="field__label">Name</span>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          autoComplete="name"
          required
          disabled={busy}
          aria-invalid={invalid && !values.name.trim() ? "true" : undefined}
        />
      </label>

      <label className="field">
        <span className="field__label">Email</span>
        <input
          type="email"
          name="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          autoComplete="email"
          required
          disabled={busy}
          aria-invalid={invalid && !EMAIL_RE.test(values.email.trim()) ? "true" : undefined}
        />
      </label>

      <label className="field">
        <span className="field__label">
          <span>Message</span>
          <span>
            {values.message.length}/{MAX_MESSAGE}
          </span>
        </span>
        <textarea
          name="message"
          rows={5}
          maxLength={MAX_MESSAGE}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          required
          disabled={busy}
          aria-invalid={invalid && !values.message.trim() ? "true" : undefined}
        />
      </label>

      <p className="form__help" role="alert">
        {invalid ? error : ""}
      </p>

      <button type="submit" disabled={busy} aria-busy={busy || undefined} className="btn btn--primary">
        {busy ? (
          <>
            <span className="spinner keep-motion" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}
