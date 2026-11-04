"use client";

import { m } from "framer-motion";
import { Briefcase, Download, GraduationCap } from "lucide-react";
import { profile, resume, type TimelineItem } from "@/data/portfolioData";
import { SectionHeader } from "./SectionHeader";

function Timeline({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Briefcase;
  items: TimelineItem[];
}) {
  return (
    <div>
      <h3 className="mb-8 flex items-center gap-3 text-2xl uppercase md:text-3xl">
        <span className="grid h-11 w-11 place-items-center border-2 border-ink bg-orange shadow-brutal-sm">
          <Icon size={20} aria-hidden="true" />
        </span>
        {title}
      </h3>
      <ol className="relative ml-[21px] border-l-[3px] border-espresso">
        {items.map((item, index) => (
          <m.li
            key={`${item.title}-${item.org}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              delay: index * 0.1,
            }}
            className="relative pb-10 pl-8 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[11px] h-[19px] w-[19px] rotate-45 border-2 border-ink bg-crimson"
            />
            <div className="border-2 border-ink bg-sand p-5 shadow-brutal transition-transform duration-150 hover:-translate-y-1 hover:shadow-brutal-lg">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink/70">
                {item.period}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              <h4 className="mt-2 text-xl">{item.title}</h4>
              <p className="font-display font-medium text-espresso">{item.org}</p>
              <ul className="mt-3 space-y-1.5 text-[0.95rem] text-ink/85">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-orange" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </m.li>
        ))}
      </ol>
    </div>
  );
}

export function Resume() {
  return (
    <section id="resume" className="border-b-2 border-ink">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeader
          index="04"
          eyebrow="Resume"
          title="The Track Record"
          description="The highlights are below — grab the full PDF for every detail."
          action={
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn btn-crimson text-base"
            >
              <Download size={18} aria-hidden="true" /> Download Full PDF
            </a>
          }
        />
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <Timeline title="Experience" icon={Briefcase} items={resume.experience} />
          <Timeline title="Education" icon={GraduationCap} items={resume.education} />
        </div>
      </div>
    </section>
  );
}
