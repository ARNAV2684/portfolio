import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { ISTClock } from "./ISTClock";

/** Footer: one closing line on the plate (the email, plainly), the profiles beneath,
 *  then the colophon with the live IST clock. */
export function Footer() {
  const { email, github, linkedin, resume } = DATA.links;

  return (
    <footer className="footer plate">
      <div className="container">
        <p className="footer__statement">
          <a href={`mailto:${email}`}>{email}</a>
        </p>
        <ul className="footer__links">
          <li>
            <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn--sm">
              GitHub
            </a>
          </li>
          <li>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn--sm">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={assetPath(resume)} download className="btn btn--sm">
              Résumé
            </a>
          </li>
        </ul>
        <div className="footer__meta">
          <span>© 2026 Arnav Gupta, Mumbai, IN</span>
          <ISTClock />
          <span>Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
