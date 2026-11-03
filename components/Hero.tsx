import { ArrowDownRight, Download, MapPin } from "lucide-react";
import { about, hero, profile } from "@/data/portfolioData";
import { SectionHeader } from "./SectionHeader";

/** Renders "*word*" segments in crimson. */
function Highlighted({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="relative whitespace-nowrap text-crimson">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b-2 border-ink">
      {/* Decorative grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#111_1px,transparent_1px),linear-gradient(90deg,#111_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8 lg:py-36">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <p className="inline-flex items-center gap-3 border-2 border-ink bg-beige px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-widest shadow-brutal-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-orange" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange" />
            </span>
            {profile.status}
          </p>
          <p className="inline-flex items-center gap-2 border-2 border-ink bg-sand px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider shadow-brutal-sm">
            <MapPin size={13} aria-hidden="true" /> {profile.location}
          </p>
        </div>

        <h1 className="font-display text-[2.75rem] leading-[0.98] font-bold tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl">
          <Highlighted text={hero.headline} />
        </h1>

        <p className="mt-8 max-w-3xl text-lg text-ink/80 md:text-2xl">{hero.subheadline}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#projects" className="brutal-btn btn-crimson text-base">
            View Projects <ArrowDownRight size={18} aria-hidden="true" />
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn btn-beige text-base"
          >
            Download Resume <Download size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="border-b-2 border-ink">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeader index="01" eyebrow="About" title="The Person Behind The Commits" />

        <div className="grid gap-6 md:grid-cols-6">
          {/* Bio */}
          <article className="brutal-card p-6 md:col-span-4 md:p-8">
            <h3 className="mb-5 text-2xl uppercase md:text-3xl">HI, I'm {profile.name.split(" ")[0]} </h3>
            <div className="space-y-4 text-ink/90">
              {about.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>

          {/* Quick facts */}
          <aside className="flex flex-col justify-between gap-6 border-2 border-ink bg-ink p-6 text-beige shadow-brutal-espresso md:col-span-2 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange">Quick Facts</p>
            <dl className="space-y-5">
              {about.quickFacts.map((fact) => (
                <div key={fact.label} className="border-b border-beige/20 pb-4 last:border-0 last:pb-0">
                  <dt className="font-mono text-xs uppercase tracking-widest text-beige/70">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          {/* Tech Arsenal */}
          <article className="brutal-card bg-beige p-6 md:col-span-3 md:p-8">
            <h3 className="mb-6 text-2xl uppercase">Tech Arsenal</h3>
            <div className="space-y-5">
              {about.skills.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/70">
                    {group.label}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border-2 border-orange bg-beige px-3 py-1 text-sm font-medium transition-colors duration-150 hover:bg-orange"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          {/* Beyond the Code */}
          <article className="brutal-card p-6 md:col-span-3 md:p-8">
            <h3 className="mb-3 text-2xl uppercase">Beyond The Code</h3>
            <p className="mb-6 text-ink/80">{about.beyondTheCode.intro}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {about.beyondTheCode.hobbies.map((h) => {
                const item = h as { label: string; emoji?: string };
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 border-2 border-ink bg-beige p-3 shadow-brutal-sm transition-transform duration-150 hover:-translate-y-0.5"
                  >
                    {item.emoji && (
                      <span className="text-2xl" aria-hidden="true">
                        {item.emoji}
                      </span>
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
