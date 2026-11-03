"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projectCategories, projects, type Project } from "@/data/portfolioData";
import { GithubIcon } from "./icons";

type Filter = (typeof projectCategories)[number];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isUnoptimized = /\.(svg|gif)$/i.test(project.image);

  return (
    <m.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 32, delay: index * 0.04 }}
      className="group flex flex-col border-2 border-ink bg-sand shadow-brutal transition-shadow duration-150 hover:shadow-brutal-lg"
    >
      <div className="relative aspect-video overflow-hidden border-b-2 border-ink bg-beige">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          unoptimized={isUnoptimized}
        />
        <span className="absolute top-3 left-3 border-2 border-ink bg-beige px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl uppercase md:text-3xl">{project.title}</h3>
        <p className="mt-3 flex-1 text-ink/85">{project.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.tech.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3 border-t-2 border-dashed border-ink/30 pt-5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn btn-crimson group/link px-4 py-2"
              aria-label={`Live demo of ${project.title}`}
            >
              Live Demo
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn btn-beige group/link px-4 py-2"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <GithubIcon size={16} /> Repo
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </m.article>
  );
}

export function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  if (projects.length === 0) {
    return (
      <div className="border-2 border-dashed border-ink/40 bg-sand/30 p-12 text-center shadow-brutal-sm">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <span className="mb-4 inline-block border-2 border-ink bg-orange px-3 py-1 font-mono text-xs uppercase tracking-widest text-ink shadow-brutal-sm">
            Status: In Progress
          </span>
          <h3 className="text-2xl uppercase">Projects Coming Soon</h3>
          <p className="mt-3 text-ink/70">
            Selected case studies, repositories, and engineering write-ups are currently being prepared. Check back shortly or view my live GitHub activity below!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div role="group" aria-label="Filter projects by category" className="mb-10 flex flex-wrap gap-3">
        {projectCategories.map((cat) => {
          const active = cat === filter;
          const count = cat === "All" ? projects.length : projects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(cat)}
              className={`inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition-[transform,box-shadow,background-color] duration-150 ${
                active
                  ? "translate-x-[2px] translate-y-[2px] bg-crimson text-white shadow-none"
                  : "bg-beige shadow-brutal-sm hover:bg-sand"
              }`}
            >
              {cat}
              <span
                className={`font-mono text-xs ${active ? "text-white/90" : "text-ink/60"}`}
                aria-hidden="true"
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
