import { Navbar } from "@/components/Navbar";
import { Hero, About } from "@/components/Hero";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { GithubActivity } from "@/components/GithubActivity";
import { Resume } from "@/components/Resume";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";

/** ISR: re-generate the page (and GitHub data) at most once per hour. */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />

        <section id="projects" className="border-b-2 border-ink">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <SectionHeader
              index="02"
              eyebrow="Selected Work"
              title="Featured Projects"
              description="Things I've designed, built, and shipped — filtered by the kind of problem they solve."
            />
            <ProjectsGrid />
          </div>
        </section>

        <GithubActivity />
        <Resume />

        <section id="faq" className="border-b-2 border-ink bg-sand/40">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
            <SectionHeader index="05" eyebrow="FAQ" title="Questions, Answered" />
            <FaqAccordion />
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
