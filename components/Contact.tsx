import { DATA } from "@/data/content";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";

/** Contact section (CLAUDE.md §5/§9): heading + form + social/résumé pills. */
export function Contact() {
  const { eyebrow, heading, sub } = DATA.contact;
  const { github, linkedin, resume } = DATA.links;

  return (
    <section id="contact" className="shell scroll-mt-24 py-14 md:py-20">
      <div className="mx-auto max-w-[600px]">
        <Reveal>
          <div className="text-center">
            <div className="font-mono-label text-accent">{eyebrow}</div>
            <h2 className="mt-2 text-3xl md:text-[2.4rem]">{heading}</h2>
            <p className="mt-3 text-mut">{sub}</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Pill href={github} label="GitHub ↗" external />
            <Pill href={linkedin} label="LinkedIn ↗" external />
            <Pill href={resume} label="Résumé ↗" download />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Pill({
  href,
  label,
  external,
  download,
}: {
  href: string;
  label: string;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      {...(download ? { download: true } : {})}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="rounded-full border border-line bg-card px-4 py-2 font-mono-label text-mut transition-colors hover:border-accent hover:text-accent"
    >
      {label}
    </a>
  );
}
