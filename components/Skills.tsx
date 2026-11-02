import { DATA } from "@/data/content";
import { HeroPanel } from "./HeroPanel";
import { SystemsDiagram } from "./SystemsDiagram";

/**
 * Stack: how the three things I build converge into one pipeline, drawn as the
 * system it is; then every tool as rows, beside the shell that can list them too.
 */
export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="head head--split head--rule">
          <h2>How it fits together.</h2>
          <p className="lead">
            Cloud/DevOps, AI/ML, and the web layer aren’t separate skill lists: they all ship through the same pipeline.
          </p>
        </div>

        <SystemsDiagram />

        <div className="grid12 stack">
          <dl className="stack__rows">
            {DATA.skills.map((g) => (
              <div key={g.label}>
                <dt>{g.label}</dt>
                <dd>{g.items.map((i) => i.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
          <HeroPanel />
        </div>
      </div>
    </section>
  );
}
