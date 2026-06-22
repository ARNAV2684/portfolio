import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { Work } from "@/components/Work";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Certs } from "@/components/Certs";
import { Community } from "@/components/Community";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

// Section order is fixed by CLAUDE.md §3 — do not reorder.
export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <StatsBand />
        <Work />
        <Experience />
        <Certs />
        <Community />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
