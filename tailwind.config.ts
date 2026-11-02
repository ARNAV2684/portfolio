import type { Config } from "tailwindcss";

/**
 * Tailwind supplies Preflight and utilities only; the design system lives in
 * app/tokens.css (Wayfind) and the page CSS in app/globals.css. These colour
 * and font names point at those tokens so any utility stays on the system.
 * `.container` is the page's own (globals.css), so Tailwind's is switched off.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  corePlugins: { container: false },
  theme: {
    extend: {
      colors: {
        bg: "var(--color-paper)",
        card: "var(--color-paper-3)",
        ink: "var(--color-ink)",
        mut: "var(--color-muted)",
        line: "var(--color-rule)",
        accent: "var(--color-accent)",
        green: "var(--color-success)",
        danger: "var(--color-error)",
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-display)"],
      },
    },
  },
  plugins: [],
};

export default config;
