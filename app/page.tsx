import { Navbar } from "@/components/Navbar";
import { Hero, About } from "@/components/Hero";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { GithubActivity } from "@/components/GithubActivity";
import { Resume } from "@/components/Resume";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
import { LanternCanvas } from "@/components/LanternCanvas";

/** ISR: re-generate the page (and GitHub data) at most once per hour. */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />

        <section id="projects" className="relative overflow-hidden border-b-2 border-ink">
          {/* Background Depth Lanterns (Staggered elevations, mist-filtered glow) */}
          <LanternCanvas
            style="pagoda"
            cordLength={38}
            scale={1.7}
            opacity={0.4}
            lightIntensity={0.58}
            chainStyle="thin"
            glowTone="crimson"
            swayDuration={5.6}
            swayDelay={-1.8}
            className="hidden xl:flex absolute top-0 left-20 xl:left-32 z-10"
          />
          <LanternCanvas
            style="globe"
            cordLength={90}
            scale={2.0}
            opacity={0.42}
            lightIntensity={0.6}
            chainStyle="iron"
            glowTone="amber"
            swayDuration={5.0}
            swayDelay={-3.1}
            className="hidden xl:flex absolute top-0 right-36 z-10"
          />

          {/* Foreground Side Lanterns (Distinct scales, chains & elevations) */}
          <LanternCanvas
            style="globe"
            cordLength={85}
            scale={3.6}
            chainStyle="brass"
            glowTone="warm"
            swayDuration={4.4}
            swayDelay={-1.2}
            lightRadius={1.15}
            className="hidden lg:flex absolute top-0 left-2 xl:left-8 z-20"
          />
          <LanternCanvas
            style="tall"
            cordLength={155}
            scale={3.2}
            chainStyle="heavy"
            glowTone="golden"
            swayAngle={2.0}
            swayDuration={5.5}
            swayDelay={-2.7}
            lightRadius={1.1}
            className="hidden lg:flex absolute top-0 right-2 xl:right-8 z-20"
          />
          {/* High-perched accent lantern on far right */}
          <LanternCanvas
            style="pagoda"
            cordLength={28}
            scale={2.4}
            chainStyle="thin"
            glowTone="crimson"
            swayDuration={3.9}
            swayAngle={3.3}
            swayDelay={-0.5}
            className="hidden 2xl:flex absolute top-0 right-32 z-20"
          />
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

        <section id="faq" className="relative overflow-hidden border-b-2 border-ink bg-sand/40">
          {/* Background Depth Lantern */}
          <LanternCanvas
            style="tall"
            cordLength={105}
            scale={1.8}
            opacity={0.42}
            lightIntensity={0.6}
            chainStyle="thin"
            glowTone="golden"
            swayDuration={5.8}
            swayDelay={-2.2}
            className="hidden xl:flex absolute top-0 right-28 z-10"
          />

          {/* Foreground Side Lanterns: Asymmetric Heights & Personalities */}
          <LanternCanvas
            style="pagoda"
            cordLength={45}
            scale={3.6}
            chainStyle="heavy"
            glowTone="crimson"
            swayDuration={4.4}
            swayDelay={-1.5}
            lightRadius={1.1}
            className="hidden lg:flex absolute top-0 left-2 xl:left-10 z-20"
          />
          <LanternCanvas
            style="globe"
            cordLength={135}
            scale={2.9}
            chainStyle="brass"
            glowTone="warm"
            swayDuration={5.2}
            swayDelay={-0.6}
            lightRadius={1.0}
            className="hidden lg:flex absolute top-0 right-2 xl:right-10 z-20"
          />
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
