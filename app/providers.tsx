"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Theme provider. Wayfind's platform colourway (light) is the default; visitors can
 * switch to the night colourway and the choice persists via next-themes.
 * `attribute="class"` toggles `.dark` on <html>, which swaps the tokens in app/tokens.css.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
