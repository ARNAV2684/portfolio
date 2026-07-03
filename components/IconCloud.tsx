"use client";

import { useEffect, useRef } from "react";

interface IconCloudProps {
  /** Icon image URLs (brand-colored SVGs from cdn.simpleicons.org). */
  images: string[];
  /** Square canvas size in CSS pixels. */
  size?: number;
}

interface CloudPoint {
  img: HTMLImageElement;
  loaded: boolean;
  x: number;
  y: number;
  z: number;
}

/** Rounded-rect path (manual — ctx.roundRect isn't in every target browser). */
function chipPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Interactive 3D icon sphere (Magic UI-style, zero deps). Icons sit on a
 * fibonacci sphere, auto-rotate slowly, and can be spun by dragging. Each logo
 * is drawn on a small white chip so dark marks (Next.js, Vercel) stay visible
 * on the dark theme. Pauses off-screen; auto-rotation stops under
 * prefers-reduced-motion (drag still works).
 */
export function IconCloud({ images, size = 340 }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesKey = images.join("|");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const srcs = imagesKey.split("|").filter(Boolean);
    const R = size * 0.36;
    const cx = size / 2;
    const cy = size / 2;
    const iconSize = Math.max(26, size / 9);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const idleSpin = reduced ? 0 : 0.0035;

    // Fibonacci sphere — even distribution regardless of icon count.
    const points: CloudPoint[] = srcs.map((src, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / srcs.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const img = new Image();
      const point: CloudPoint = {
        img,
        loaded: false,
        x: R * Math.cos(theta) * Math.sin(phi),
        y: R * Math.sin(theta) * Math.sin(phi),
        z: R * Math.cos(phi),
      };
      img.onload = () => {
        point.loaded = true;
      };
      // Failed icons (404 slug, offline) simply never join the sphere.
      img.src = src;
      return point;
    });

    let rx = -0.3; // tilt
    let ry = 0;
    let vx = 0; // drag-imparted velocity
    let vy = idleSpin;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);

      const projected = points
        .map((p) => {
          const x1 = p.x * cosY + p.z * sinY;
          const z1 = -p.x * sinY + p.z * cosY;
          const y1 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;
          return { p, x: x1, y: y1, z: z2 };
        })
        .sort((a, b) => a.z - b.z); // back-to-front

      for (const { p, x, y, z } of projected) {
        if (!p.loaded) continue; // not loaded yet or 404 — no ghost chips
        const depth = (z + R) / (2 * R); // 0 = back, 1 = front
        const scale = 0.55 + depth * 0.55;
        const alpha = 0.22 + depth * 0.78;
        const s = iconSize * scale;
        const px = cx + x;
        const py = cy + y;
        const pad = s * 0.24;

        ctx.globalAlpha = alpha;
        chipPath(ctx, px - s / 2 - pad, py - s / 2 - pad, s + pad * 2, s + pad * 2, 6 * scale);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        try {
          ctx.drawImage(p.img, px - s / 2, py - s / 2, s, s);
        } catch {
          // SVG without intrinsic size on an old browser — chip alone is fine.
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      if (!dragging) {
        ry += vy;
        rx += vx;
        rx = Math.max(-1.1, Math.min(1.1, rx));
        vx *= 0.95;
        vy += (idleSpin - vy) * 0.02; // ease back to the idle spin after a fling
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      ry += dx * 0.005;
      rx = Math.max(-1.1, Math.min(1.1, rx - dy * 0.005));
      vy = dx * 0.0002;
      vx = -dy * 0.0002;
      draw();
    };
    const onUp = () => {
      dragging = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    // Only burn frames while the cloud is actually on screen.
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        cancelAnimationFrame(raf);
        if (e.isIntersecting) raf = requestAnimationFrame(tick);
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [imagesKey, size]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Rotating cloud of technology logos — drag to spin"
      className="cursor-grab select-none active:cursor-grabbing"
      style={{ width: size, height: size, touchAction: "pan-y" }}
    />
  );
}
