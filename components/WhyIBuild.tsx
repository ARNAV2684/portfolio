import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";

/** Why I build: the owner's portrait beside the note, the first thing under the poster. */
export function WhyIBuild() {
  const { heading, paragraphs } = DATA.whyIBuild;

  return (
    <section id="why" className="section section--first">
      <div className="container grid12 why">
        <figure className="why__photo">
          <div className="why__frame" data-slot="portrait" data-alt="A portrait of Arnav, head and shoulders, square crop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetPath("/arnav.jpg")} alt={DATA.name} width={413} height={413} loading="lazy" />
          </div>
          <figcaption>{DATA.name}, Mumbai</figcaption>
        </figure>

        <div className="why__text">
          <h2>{heading}</h2>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
