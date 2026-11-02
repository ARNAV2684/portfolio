import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";

/** Hero: the statement on an ink plate, low and left, with the one live sign
 *  (Flickstat's real count) up and to the right. */
export function Hero() {
  const { hero, links } = DATA;
  const flickstat = DATA.projects.find((p) => p.type === "LIVE");

  return (
    <section className="hero plate" aria-labelledby="hero-title">
      <div className="container grid12 hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title">
            {hero.line1} {hero.line2accent}
          </h1>
          <p className="lead hero__line">{hero.line}</p>
          <div className="hero__actions">
            <a href={assetPath(links.resume)} download className="btn btn--primary">
              Download résumé
            </a>
            <a href={`mailto:${links.email}`} className="btn">
              Email me
            </a>
          </div>
        </div>

        {flickstat?.metric && (
          <aside className="hero__sign sign" aria-label="Live now: Flickstat">
            <p className="sign__row">
              <span className="live-sq" aria-hidden="true" />
              Live now on flickstat.com
            </p>
            <div className="sign__body">
              <p className="sign__figure">{flickstat.metric.value}</p>
              <p className="sign__unit">{flickstat.metric.label} since launch</p>
              {flickstat.secondaryMetric && (
                <dl className="sign__pair">
                  <dt>{flickstat.secondaryMetric.label}</dt>
                  <dd>{flickstat.secondaryMetric.value}</dd>
                </dl>
              )}
            </div>
            <p className="sign__foot">
              <small>Source: Vercel Analytics, Oct 2026</small>
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
