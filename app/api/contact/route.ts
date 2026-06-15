import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getResend } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 2000;

// ── Naive in-memory rate limit (per warm instance) to deter casual abuse (§9).
//    Resets on cold start; for stronger limits use Upstash/Vercel KV later.
const RATE = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = RATE.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    RATE.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "")
    .trim()
    .slice(0, MAX_MESSAGE);
  const honeypot = String(body.company ?? "");
  const elapsedMs = Number(body.elapsedMs ?? 0);

  // ── Spam checks (§9): honeypot filled → silently accept-drop; too-fast submit → reject.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }
  if (!Number.isFinite(elapsedMs) || elapsedMs < 2000) {
    return NextResponse.json(
      { error: "Please take a moment before submitting." },
      { status: 400 }
    );
  }

  // ── Validation
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const userAgent = req.headers.get("user-agent") ?? "";

  // ── Fallback (b) — Formspree-only: if FORMSPREE_ENDPOINT is set, forward & return.
  //    (No Supabase / Resend needed for this path; see CLAUDE.md §9 fallbacks.)
  const formspree = process.env.FORMSPREE_ENDPOINT;
  if (formspree) {
    try {
      const r = await fetch(formspree, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!r.ok) throw new Error("Formspree rejected the submission");
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: "Could not send your message. Please email me directly." },
        { status: 502 }
      );
    }
  }

  // ── Primary path — Supabase (store) + Resend (notify).
  const supabase = getSupabaseAdmin();
  const resend = getResend();

  if (!supabase || !resend) {
    return NextResponse.json(
      {
        error:
          "Contact backend isn't configured yet. Please email me directly in the meantime.",
      },
      { status: 503 }
    );
  }

  // 1) Store in Supabase `contact_messages` (see TODO-BEFORE-LAUNCH.md for the schema).
  const { error: dbError } = await supabase
    .from("contact_messages")
    .insert({ name, email, message, user_agent: userAgent });

  if (dbError) {
    return NextResponse.json(
      { error: "Could not save your message. Please email me directly." },
      { status: 500 }
    );
  }

  // 2) Notify via Resend. The message is already stored, so an email hiccup is soft-failed.
  const to = process.env.CONTACT_TO_EMAIL || "arug2004@gmail.com";
  const from =
    process.env.RESEND_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  try {
    await resend.emails.send({
      from,
      to,
      // Add `replyTo: email` if your Resend SDK version supports it (field name
      // varies across versions); the sender's email is included in the body below.
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}\n\n— sent from the portfolio contact form`,
    });
  } catch {
    return NextResponse.json({ ok: true, warning: "stored-but-email-failed" });
  }

  return NextResponse.json({ ok: true });
}
