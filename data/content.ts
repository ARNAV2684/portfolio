// ─────────────────────────────────────────────────────────────────────────────
// ALL site copy & data lives here (CLAUDE.md §4). Editing content never requires
// touching a component. Placeholders marked `<<FILL>>` are collected in
// TODO-BEFORE-LAUNCH.md at the repo root.
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectType = "LIVE" | "PRIVATE" | "OPEN SOURCE";

export type ProjectMedia =
  | { kind: "live"; src?: string; poster?: string }
  | { kind: "video"; src: string; poster: string }
  | { kind: "image"; src: string; alt: string };

export interface CaseStudy {
  challenge: string;
  role: string;
  process: string[];
  result: string;
}

export interface Project {
  title: string;
  kind: string;
  type: ProjectType;
  /** Bottom-of-card call to action. Rendered as a link when `href` is set,
   *  otherwise as a plain caption (e.g. PRIVATE projects — the clip is the proof). */
  action: string;
  href: string;
  media: ProjectMedia;
  desc: string;
  tags: string[];
  /** Optional headline impact stat, surfaced as a chip on the card so the proof
   *  reads in a 5-second scan. Omit when there's no honest number to lead with. */
  metric?: { value: string; label: string };
  /** Expandable case study — when present, the card shows a "read case study" toggle
   *  that reveals an in-card drawer with the long-form story. */
  caseStudy?: CaseStudy;
}

export interface Metric {
  from: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface Experience {
  org: string;
  loc: string;
  role: string;
  when: string;
  now?: boolean;
  desc: string;
  metrics: Metric[];
}

export interface Cert {
  name: string;
  sub: string;
  date: string;
  badgeImg: string;
  verifyUrl: string;
  ring: string;
}

export interface CommunityCard {
  t: string;
  s: string;
}

/** A stats-band tile is either a count-up number or a literal string (e.g. "’26"). */
export type StatTile =
  | { value: number; suffix?: string; label: string }
  | { literal: string; label: string };

export interface SkillGroup {
  label: string;
  items: string[];
  /** The lead group (Cloud & DevOps) is visually emphasized to anchor the identity. */
  accent?: boolean;
}

export interface PortfolioData {
  name: string;
  role: string;
  status: string;
  hero: { line1: string; line2accent: string; sub: string };
  links: { email: string; github: string; linkedin: string; resume: string };
  stats: StatTile[];
  projects: Project[];
  skills: SkillGroup[];
  experience: Experience[];
  certs: Cert[];
  community: { p1: string; p2: string; cards: CommunityCard[] };
  contact: { eyebrow: string; heading: string; sub: string };
}

export const DATA: PortfolioData = {
  name: "Arnav Gupta",
  role: "Cloud & DevOps Engineer",
  status: "shipping flickstat · open to cloud / DevOps roles ’26",
  hero: {
    line1: "I design systems",
    line2accent: "and ship them to the cloud.",
    sub: "Cloud & DevOps engineer who loves taking a blank repo to production — architecture, AWS infra, containers, CI/CD — with a year of hands-on ML & computer-vision work as the foundation. Give me something to build and I learn it and ship it.",
  },
  links: {
    email: "arug2004@gmail.com",
    github: "https://github.com/ARNAV2684",
    linkedin: "https://www.linkedin.com/in/arnav-gupta-2b8b202b2/",
    resume: "/Arnav_Gupta_Resume.pdf",
  },
  stats: [
    { value: 2, suffix: "×", label: "AWS certified" },
    { value: 1200, suffix: "+", label: "Flickstat visitors" },
    { value: 20, suffix: "+", label: "hackathons & meetups" },
    { literal: "’26", label: "graduating" },
  ],
  projects: [
    {
      title: "Flickstat",
      kind: "Founder · Full-Stack & Systems",
      type: "LIVE",
      action: "Visit flickstat.com ↗",
      href: "https://flickstat.com",
      media: { kind: "live", src: "https://flickstat.com", poster: "" },
      desc: "A free, analytics-native football platform — founded it and built the entire stack solo on a 3-person team: a Python data pipeline, a Supabase Postgres backend, and a Next.js frontend on Vercel, with a canonical entity-resolution layer unifying four providers and hybrid ISR/SSR serving 1,000+ pages.",
      tags: ["Next.js", "Supabase", "Python", "Vercel"],
      metric: { value: "~1,200", label: "visitors · month one" },
      caseStudy: {
        challenge:
          "Football stats are everywhere — but four major providers each call the same player a different name with conflicting IDs. Building anything analytics-grade meant solving that mess first.",
        role:
          "Founder & sole engineer on a 3-person team. Owned architecture end-to-end: data ingestion, schema, entity resolution, backend, frontend, deploy, observability.",
        process: [
          "Wrote a Python pipeline that ingests four provider feeds nightly and normalizes them into a canonical schema",
          "Built an entity-resolution layer (fuzzy match + manual override table) that unifies player/team IDs across sources",
          "Modeled the analytics layer in Supabase Postgres with materialized views for hot paths",
          "Frontend on Next.js (App Router) — hybrid ISR for player/team pages, SSR for live match views, 1,000+ pre-rendered routes",
          "Deployed on Vercel with CI gates on schema drift",
        ],
        result:
          "Live at flickstat.com — ~1,200 visitors in month one, organic growth, zero paid acquisition. Now the foundation for the next product layer.",
      },
    },
    {
      title: "SAM Auto-Annotation",
      kind: "GarudaUAV · Computer Vision",
      type: "PRIVATE",
      action: "▶ demo clip",
      href: "",
      media: { kind: "video", src: "/clips/sam-demo.mp4", poster: "" },
      desc: "One-click image labeling on Meta's Segment Anything Model with multi-format export (YOLO / COCO / Pascal VOC), batch processing, and a Gradio UI — cutting manual annotation effort by up to 80%.",
      tags: ["SAM", "Gradio", "Python"],
      metric: { value: "↓80%", label: "labeling effort" },
      caseStudy: {
        challenge:
          "The team was burning hours hand-annotating drone imagery for downstream YOLO training. Manual labeling was the actual bottleneck on every new dataset.",
        role:
          "Sole engineer on the tool. Spec, model integration, UI, and rollout to the wider team.",
        process: [
          "Wrapped Meta's Segment Anything Model behind a single-click point/box prompt interface",
          "Built multi-format export — YOLO, COCO, and Pascal VOC — so it slotted into existing training pipelines without adapter code",
          "Added batch mode so a folder of images could be processed unattended",
          "Wrapped it all in a Gradio UI that non-engineers on the team could use directly",
        ],
        result:
          "Cut manual annotation effort by up to 80% on the team's drone datasets. Now part of the standard preprocessing flow at GarudaUAV.",
      },
    },
    {
      title: "End-to-End ML Data Pipeline",
      kind: "Open Source · Systems",
      type: "OPEN SOURCE",
      action: "View on GitHub ↗",
      href: "https://github.com/ARNAV2684/DataPro",
      media: { kind: "image", src: "/clips/datapro-screenshot.png", alt: "DataLab Pro — data type selection UI" },
      desc: "A config-driven platform turning raw file/DB/API data into trained models — validation, cleaning, feature processing, augmentation, and evaluation — with versioned, reproducible runs. Containerized with Docker behind a React/TypeScript control UI.",
      tags: ["FastAPI", "Docker", "Python", "React"],
      metric: { value: "Dockerized", label: "reproducible runs" },
      caseStudy: {
        challenge:
          "Every ML side project re-implements the same five stages from scratch — load, validate, clean, augment, evaluate — and none of them are reproducible six weeks later.",
        role:
          "Open-source. Solo build. Architecture, API design, and frontend.",
        process: [
          "Designed a YAML-driven config layer so each pipeline run is fully declarative",
          "Built a FastAPI backend that orchestrates the five stages with versioned artifacts at each step",
          "React/TypeScript control UI for kicking off runs, comparing metrics, and inspecting failures",
          "Dockerized the whole thing — same image runs locally, in CI, and on a cloud worker",
        ],
        result:
          "Open-sourced on GitHub. Any data source → trained model in one config file, reproducible months later.",
      },
    },
  ],
  skills: [
    {
      label: "Cloud & DevOps",
      accent: true,
      items: [
        "AWS (ECS · RDS · ALB · ECR)",
        "Terraform",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "CloudWatch",
        "Git",
      ],
    },
    {
      label: "AI / ML & CV",
      items: [
        "PyTorch",
        "TensorFlow",
        "OpenCV",
        "YOLOv8 / v11",
        "SAM",
        "GroundingDINO",
        "ResNet",
        "scikit-learn",
        "LLMs / AI agents",
      ],
    },
    {
      label: "Web & Backend",
      items: [
        "Next.js",
        "React",
        "Node.js",
        "FastAPI",
        "Tailwind CSS",
        "Supabase (Postgres)",
      ],
    },
    {
      label: "Languages",
      items: ["Python", "TypeScript", "Go", "C", "SQL"],
    },
    {
      label: "Tools",
      items: ["Playwright", "n8n", "Jupyter", "Cursor", "VS Code", "Notion"],
    },
  ],
  experience: [
    {
      org: "GarudaUAV",
      loc: "Noida",
      role: "AI / Computer Vision Engineering Intern",
      when: "Jan 2026 — Present",
      now: true,
      desc: "Shipped a SAM auto-annotation tool with multi-format export, an LLM-powered model-eval report generator, and a retraining-free six-stage aerial tree-detection pipeline (GroundingDINO + ResNet-18 + Random Forest).",
      metrics: [
        { from: 0, to: 80, prefix: "↓", suffix: "%", label: "labeling effort" },
        { from: 0, to: 8, label: "eval metrics auto-extracted" },
      ],
    },
    {
      org: "GarudaUAV",
      loc: "Noida",
      role: "AI / ML Intern",
      when: "Jun — Aug 2025",
      desc: "Built a YOLOv8 culvert-detection pipeline for drone imagery — tuned class-specific thresholds, cut false positives by 18%, and expanded the dataset with mosaic augmentation and synthetic data. This is where my ML foundation was built.",
      metrics: [
        { from: 0.63, to: 0.71, decimals: 2, label: "mAP@0.50 ↑" },
        { from: 0.68, to: 0.76, decimals: 2, label: "recall ↑" },
        { from: 300, to: 1240, label: "training images" },
      ],
    },
    {
      org: "Startup School",
      loc: "Mumbai",
      role: "Operations & Community Lead",
      when: "Mar — Apr 2026",
      desc: "Ran on-ground ops for a founder meetup, coordinated a 4-person distributed team, and secured a free Andheri venue via a DevX co-marketing partnership — removing the event's biggest cost for a bootstrapped startup.",
      metrics: [
        { from: 0, to: 4, label: "person team" },
        { from: 0, to: 3, label: "cities of outreach" },
      ],
    },
  ],
  certs: [
    {
      name: "AWS Solutions Architect",
      sub: "Associate",
      date: "May 2026",
      badgeImg: "/badges/aws-saa.png",
      verifyUrl: "https://www.credly.com/badges/c90d5da9-c36d-4fe6-ab7f-cbf27ecc7b6c",
      ring: "#2E73B8",
    },
    {
      name: "AWS Cloud Practitioner",
      sub: "Foundational",
      date: "Apr 2025",
      badgeImg: "/badges/aws-ccp.png",
      verifyUrl: "https://www.credly.com/badges/3e09954b-26fe-4e92-a2af-6732227ee24b",
      ring: "#586A78",
    },
  ],
  community: {
    p1: "I spend a lot of my time inside India's tech community — not just attending, but hosting. I help run and show up at Mumbai tech meetups, connecting builders and turning rooms full of strangers into people who ship together afterwards.",
    p2: "Hackathons are where a lot of my projects start — tight deadlines, a blank repo, and a working demo by the end. I've organized a couple myself, and they're the fastest way I know to learn a new stack and find the people worth building with. That same instinct led to my Startup School run — owning on-ground ops for a founder meetup and pitching a co-marketing partnership that landed a free venue.",
    cards: [
      { t: "Meetup host", s: "Mumbai tech community" },
      { t: "Hackathon organizer", s: "ran & shipped at hackathons" },
      { t: "Startup School", s: "ops · outreach · Mumbai/Pune/Delhi" },
    ],
  },
  contact: {
    eyebrow: "// say hi",
    heading: "Let's build something.",
    sub: "Got a role, a project, or just want to nerd out about cloud, systems, or ML? My inbox is open.",
  },
};
