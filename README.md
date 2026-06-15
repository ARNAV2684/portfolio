# Arnav Gupta — Portfolio

A fast, single-page personal portfolio. Next.js 14 (App Router) · TypeScript · Tailwind.
Built to the spec in `CLAUDE.md`.

## Stack
- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS** with CSS-variable design tokens (light + dark)
- **next-themes** for the light/dark toggle
- Fonts: **Hanken Grotesque** (next/font) + **Geist Mono** (`geist`)
- Contact backend: Route Handler → **Supabase** (store) + **Resend** (notify),
  with a **Formspree-only** fallback (set `FORMSPREE_ENDPOINT`)
- Motion: CSS transitions + IntersectionObserver (count-up, scroll reveals, lazy video)

## Run locally
```bash
npm install
npm run dev          # http://localhost:3010
```

Build / preview the production bundle:
```bash
npm run build
npm run start        # serves the production build on http://localhost:3010
```

> The site runs fine **without** any env vars — the contact form just returns a
> "backend not configured" message until you add them. See `.env.example`.

## Contact backend (optional to run locally)
1. `cp .env.example .env.local` and fill in values.
2. Create the Supabase `contact_messages` table (SQL in `TODO-BEFORE-LAUNCH.md` §7).
3. Add a Resend API key + verified sender.
4. Submit the form locally to test the full path.

To skip Supabase/Resend entirely, set only `FORMSPREE_ENDPOINT` — the route auto-switches.

## Editing content
All copy/data lives in **`data/content.ts`** — content edits never touch components.
Search for `<<FILL>>` (and see `TODO-BEFORE-LAUNCH.md`) for placeholders to replace.

## Deploy to Vercel
1. Push to a new GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new) (auto-detects Next.js).
3. Add the env vars from `.env.example` in **Project → Settings → Environment Variables**
   (Production + Preview).
4. Deploy → you get a `*.vercel.app` URL. Verify the contact form end-to-end.
5. Add a custom domain in **Settings → Domains** and update `SITE_URL` in
   `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts`.

## Project structure
```
app/        layout, page, globals.css, api/contact, opengraph-image, icon, sitemap, robots
components/ Nav, Hero, StatsBand, Work, ProjectCard, Experience, Certs, Community,
            Contact, ContactForm, Footer, Count, Reveal, ThemeToggle, ISTClock, SectionHeading
data/       content.ts  (ALL content)
lib/        supabase.ts, resend.ts, useReducedMotion.ts
public/     clips/ (demo videos), badges/ (AWS PNGs), résumé PDF
```
