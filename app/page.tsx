import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BootLoader } from "@/components/BootLoader";
import { BackToTop } from "@/components/BackToTop";
import { CommandPalette } from "@/components/CommandPalette";
import { Hero } from "@/components/Hero";
import { WhyIBuild } from "@/components/WhyIBuild";
import { GitHubActivity } from "@/components/GitHubActivity";
import { Work } from "@/components/Work";
import { Experience } from "@/components/Experience";
import { Certs } from "@/components/Certs";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

// The owner's section order: hero, why I build, recent commits, work, experience,
// credentials and community, stack, contact. Certs carries the #community anchor.
export default function Page() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <BootLoader />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <WhyIBuild />
        <GitHubActivity />
        <Work />
        <Experience />
        <Certs />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette />
    </>
  );
}
