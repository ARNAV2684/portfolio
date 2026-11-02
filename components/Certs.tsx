"use client";

import { useState } from "react";
import { DATA, type Cert } from "@/data/content";
import { assetPath } from "@/lib/assetPath";

/**
 * Credentials and community, two ledgers side by side on a change of paper:
 * the AWS certifications with their Credly verification, and the community
 * work (meetups, hackathons, Startup School). Carries both #certs and #community.
 */
export function Certs() {
  const { p1, p2, cards } = DATA.community;
  const tally = DATA.stats.find((s) => s.label === "hackathons & meetups");

  return (
    <section id="certs" className="section--band">
      <div className="container grid12 ledgers">
        <div className="ledgers__certs">
          <h2>Certifications</h2>
          {DATA.certs.map((c) => (
            <CertRow key={c.name} cert={c} />
          ))}
        </div>

        <div id="community" className="ledgers__community community">
          <h2>Community &amp; hackathons</h2>
          {tally && "value" in tally && (
            <p className="tally">
              <b>
                {tally.value}
                {tally.suffix}
              </b>
              <span>{tally.label}</span>
            </p>
          )}
          <p>{p1}</p>
          <p>{p2}</p>
          <ul className="roles">
            {cards.map((c) => (
              <li key={c.t}>
                <b>{c.t}</b>
                <span>{c.s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CertRow({ cert }: { cert: Cert }) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="cert">
      {errored ? (
        <span className="cert__badge" aria-label={`${cert.name} badge placeholder`}>
          AWS
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assetPath(cert.badgeImg)}
          alt={`${cert.name} (${cert.sub}) badge`}
          width={64}
          height={64}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      )}
      <h3>{cert.name}</h3>
      <p className="cert__meta">
        <span>
          {cert.sub}, issued {cert.date}
        </span>
        {cert.verifyUrl ? (
          <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="textlink">
            Verify on Credly
          </a>
        ) : (
          <span>Verify credential</span>
        )}
      </p>
    </div>
  );
}
