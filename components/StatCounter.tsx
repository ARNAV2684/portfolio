import Script from "next/script";

/**
 * StatCounter invisible visitor tracking (project 13342205) — pure background
 * script, zero visual footprint (per "Invisible Tracking" mode). Loads on
 * every page across both arnav.works and the GitHub Pages mirror; no
 * assetPath/basePath handling needed since every URL here is already
 * absolute to statcounter.com, not a local asset.
 *
 * Gated to production only so local dev/preview sessions (including agent
 * testing) don't pollute the visitor log with non-visitor traffic. `next
 * build` always resolves NODE_ENV to "production" for the shipped bundle
 * regardless of the shell env it's run in, so this correctly renders on
 * both real deployments and stays dark under `next dev`.
 */
export function StatCounter() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script id="statcounter-vars" strategy="lazyOnload">
        {`var sc_project=13342205; var sc_invisible=1; var sc_security="df2f7a81";`}
      </Script>
      <Script
        id="statcounter-counter"
        src="https://www.statcounter.com/counter/counter.js"
        strategy="lazyOnload"
      />
      <noscript>
        <div className="statcounter">
          <a
            title="Web Analytics Made Easy - Statcounter"
            href="https://statcounter.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="statcounter"
              src="https://c.statcounter.com/13342205/0/df2f7a81/1/"
              alt="Web Analytics Made Easy - Statcounter"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>
    </>
  );
}
