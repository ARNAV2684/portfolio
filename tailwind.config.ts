import type { Config } from "tailwindcss";

/**
 * Colors map to the CSS variables defined in app/globals.css so components
 * never hardcode hex values (see CLAUDE.md §2). Light + dark token sets live
 * in globals.css; `darkMode: "class"` is driven by next-themes.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        ink: "var(--ink)",
        mut: "var(--mut)",
        line: "var(--line)",
        accent: "var(--accent)",
        green: "var(--green)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        display: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
      borderRadius: {
        card: "16px",
      },
      transitionTimingFunction: {
        reveal: "cubic-bezier(.2,.7,.2,1)",
      },
    },
  },
  plugins: [],
};

export default config;
