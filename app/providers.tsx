"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Theme provider. Dark ("black") is the primary/default mode; visitors land in dark
 * and can switch to light, and the choice persists via next-themes. `attribute="class"`
 * toggles `.dark` on <html>, which swaps the token set defined in globals.css.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
