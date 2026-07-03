"use client";

import { useEffect, useRef } from "react";

const SPACING = 30; // grid pitch in CSS px
const PACKET_COUNT = 7;
const GLOW_RADIUS = 130; // cursor influence radius

interface Packet {
  axis: "h" | "v";
  line: number; // grid line index
  pos: number; // head position along the axis
  speed: number;
  len: number; // trail length
}

/**
 * Ambient "infrastructure" backdrop for the hero: a faint dot grid with data
 * packets streaking along grid lines, plus a cursor glow that tints nearby
 * dots accent. Decorative only (aria-hidden, pointer-events: none).
 * Renders only while on screen; reduced-motion gets a static grid, no packets.
 */
export function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    if (!host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let dots: HTMLCanvasElement | null = null; // pre-rendered static dot layer
    let packets: Packet[] = [];
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999 };

    const makePacket = (): Packet => {
      const axis = Math.random() < 0.6 ? "h" : "v";
      const len = 40 + Math.random() * 70;
      return {
        axis,
        line: 1 + Math.floor(Math.random() * ((axis === "h" ? rows : cols) - 1)),
        pos: -len - Math.random() * (axis === "h" ? w : h),
        speed: 1.1 + Math.random() * 1.6,
        len,
      };
    };

    const resize = () => {
      w = host.clientWidth;
      h = host.clientHeight;
      cols = Math.ceil(w / SPACING);
      rows = Math.ceil(h / SPACING);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Bake the static dots once per resize — blitting beats 1k arcs a frame.
      dots = document.createElement("canvas");
      dots.width = w * dpr;
      dots.height = h * dpr;
      const dctx = dots.getContext("2d");
      if (dctx) {
        dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dctx.fillStyle = "rgba(128, 128, 142, 0.16)";
        for (let i = 1; i < cols; i++) {
          for (let j = 1; j < rows; j++) {
            dctx.beginPath();
            dctx.arc(i * SPACING, j * SPACING, 1, 0, Math.PI * 2);
            dctx.fill();
          }
        }
      }
      packets = Array.from({ length: PACKET_COUNT }, makePacket);
      if (reduced && dots) {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(dots, 0, 0, w, h);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (dots) ctx.drawImage(dots, 0, 0, w, h);

      // Packets: accent trails along grid lines, fading toward the tail.
      for (const p of packets) {
        const along = p.axis === "h" ? w : h;
        p.pos += p.speed;
        if (p.pos - p.len > along) {
          Object.assign(p, makePacket());
          continue;
        }
        const c = p.line * SPACING;
        const head = p.pos;
        const tail = p.pos - p.len;
        const grad =
          p.axis === "h"
            ? ctx.createLinearGradient(tail, 0, head, 0)
            : ctx.createLinearGradient(0, tail, 0, head);
        grad.addColorStop(0, "rgba(59, 67, 245, 0)");
        grad.addColorStop(1, "rgba(59, 67, 245, 0.55)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        if (p.axis === "h") {
          ctx.moveTo(tail, c);
          ctx.lineTo(head, c);
        } else {
          ctx.moveTo(c, tail);
          ctx.lineTo(c, head);
        }
        ctx.stroke();
      }

      // Cursor influence: nearby dots re-drawn in accent, brighter when closer.
      if (mouse.x > -999) {
        const i0 = Math.max(1, Math.floor((mouse.x - GLOW_RADIUS) / SPACING));
        const i1 = Math.min(cols - 1, Math.ceil((mouse.x + GLOW_RADIUS) / SPACING));
        const j0 = Math.max(1, Math.floor((mouse.y - GLOW_RADIUS) / SPACING));
        const j1 = Math.min(rows - 1, Math.ceil((mouse.y + GLOW_RADIUS) / SPACING));
        for (let i = i0; i <= i1; i++) {
          for (let j = j0; j <= j1; j++) {
            const dx = i * SPACING - mouse.x;
            const dy = j * SPACING - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d > GLOW_RADIUS) continue;
            const t = 1 - d / GLOW_RADIUS;
            ctx.fillStyle = `rgba(59, 67, 245, ${0.12 + t * 0.5})`;
            ctx.beginPath();
            ctx.arc(i * SPACING, j * SPACING, 1 + t * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);
    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    />
  );
}
