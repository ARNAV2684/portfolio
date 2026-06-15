# TODO before launch

Every `<<FILL>>` marker and pre-launch checklist item from CLAUDE.md §13, plus a few
notes from the build. Most are content/asset/accuracy items — the site builds and runs
without them, showing tasteful placeholders.

> **Note:** the `preview-COMPLETE-site.jsx` visual reference named in CLAUDE.md was not
> available in the project, so the UI was built faithfully from the written spec (§2–§9).
> Tweak spacing/colors against your preview if/when you have it.

---

## 1. Links & identity  → `data/content.ts`
- [x] **GitHub URL** — `https://github.com/ARNAV2684`.
- [x] **LinkedIn URL** — `https://www.linkedin.com/in/arnav-gupta-2b8b202b2/`.
- [x] **Open-source repo URL** for the ML Data Pipeline — `https://github.com/ARNAV2684/DataPro`.

## 2. Résumé  → `/public`
- [x] Added **`Arnav_Gupta_Resume.pdf`** to `/public/` (copied from the DevOps résumé).

## 3. Stats accuracy  → `data/content.ts` (`stats`)
- [x] Replaced the unverified `hackathons & meetups` tile with `1,000+ pages served · Flickstat`.
- [ ] Confirm **“1,200+ Flickstat visitors”**, **“1,000+ pages served”**, **“2× AWS certified”**
      are current before you point people at the site.

## 4. Certifications  → `data/content.ts` (`certs`) + `/public/badges`
- [x] Added **Credly badge PNGs**: `/public/badges/aws-saa.png`, `/public/badges/aws-ccp.png`.
- [x] Added **Credly verify URLs** for both certs.
- [ ] Confirm cert **dates** (`May 2026`, `Apr 2025`) are accurate.

## 5. Demo clips (PRIVATE projects)  → `/public/clips`
- [ ] Record + add **`sam-demo.mp4` + `sam-poster.jpg`** and
      **`pipeline-demo.mp4` + `pipeline-poster.jpg`** (see `public/clips/README.md`).
      ~10–15s, muted, compressed < ~3–4 MB, with a poster still.
- [ ] (Optional) Add more PRIVATE clip projects — same shape in `projects[]`.

## 6. Accuracy / honesty pass (every number must be interview-defensible — CLAUDE.md §4 note)
- [ ] Confirm the experience metrics: `↓80% labeling effort`, `8 auto-extracted metrics`,
      `mAP 0.63→0.71`, `recall 0.68→0.76`, `1240 training images`, team/outreach counts.
- [ ] Confirm the **community write-up** (`community.p1`/`p2`) matches your actual
      involvement, and that the **DevX free-venue** story is OK to publish.

## 7. Contact backend  → choose one, then set env vars (you said you'll do this)
Primary path is **Supabase + Resend** (code is already written in
`app/api/contact/route.ts`, `lib/supabase.ts`, `lib/resend.ts`).

- [ ] Create the Supabase table (SQL below) and enable RLS.
- [ ] Set env vars locally in `.env.local` and in Vercel (Production + Preview):
      `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`,
      `CONTACT_TO_EMAIL`, `RESEND_FROM_EMAIL`.
- [ ] Verify a verified sender/domain in Resend (or use `onboarding@resend.dev` to test).
- [ ] (Alternative) To use **Formspree-only** instead, just set `FORMSPREE_ENDPOINT` —
      the route auto-switches and skips Supabase/Resend.

```sql
-- Supabase: contact_messages table (CLAUDE.md §9)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Enable RLS; the route handler inserts via the service role (which bypasses RLS).
alter table public.contact_messages enable row level security;
-- No client policies are needed since only the server (service role) writes/reads.
```

## 8. SEO / domain  → `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`
- [x] Buy a **custom domain** — `arnav.works` (GitHub Student Pack / Name.com).
- [x] Update `SITE_URL` to `https://arnav.works` in all three files.
- [ ] Connect `arnav.works` in **Vercel → Settings → Domains** and verify DNS.
- [ ] (Optional) Embed Hanken Grotesque in `app/opengraph-image.tsx` for exact brand
      weight; it currently uses next/og's default font (layout/colors are on-brand).

## 9. Deferred (NOT built yet — future work, per CLAUDE.md §14)
- [ ] Per-project case-study pages (`/projects/[slug]`)
- [ ] Embedded live Flickstat demo (iframe/screenshot)
- [ ] ⌘K command palette
- [ ] Analytics
