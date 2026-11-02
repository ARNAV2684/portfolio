import { DATA } from "@/data/content";
import { assetPath } from "@/lib/assetPath";
import { ContactForm } from "./ContactForm";

/** Contact: the head and the plain facts (email, profiles, résumé) beside the form. */
export function Contact() {
  const { heading, sub } = DATA.contact;
  const { email, github, linkedin, resume } = DATA.links;

  return (
    <section id="contact" className="section section--close">
      <div className="container grid12 contact">
        <div className="contact__head">
          <h2>{heading}</h2>
          <p className="lead">{sub}</p>
          <dl className="facts">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${email}`} className="textlink">
                  {email}
                </a>
              </dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a href={github} target="_blank" rel="noopener noreferrer" className="textlink">
                  {github.replace(/^https:\/\//, "")}
                </a>
              </dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="textlink">
                  Arnav Gupta
                </a>
              </dd>
            </div>
            <div>
              <dt>Résumé</dt>
              <dd>
                <a href={assetPath(resume)} download className="textlink">
                  Download the PDF
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="contact__form">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
