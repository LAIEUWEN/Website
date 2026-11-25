"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { projectCategories, projects, type Project, type ProjectCategory } from "@/data/portfolioData";
import { GithubIcon } from "./icons";

type Filter = (typeof projectCategories)[number];

function getProjectCategories(project: Project): ProjectCategory[] {
  return project.categories && project.categories.length > 0
    ? project.categories
    : [project.category];
}

function matchesCategory(project: Project, filter: Filter): boolean {
  if (filter === "All") return true;
  return getProjectCategories(project).includes(filter);
}

function ProjectMedia({
  project,
  featured,
}: {
  project: Project;
  featured: boolean;
}) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videos = project.videos ?? [];
  const activeVideo = videos[activeVideoIndex];

  const borderClasses = featured
    ? "border-b-2 border-ink md:border-r-2 md:border-b-0"
    : "border-b-2 border-ink";

  if (videos.length > 0 && activeVideo) {
    return (
      <div
        className={`relative flex flex-col justify-between bg-beige p-5 sm:p-6 ${borderClasses}`}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {getProjectCategories(project).map((cat) => (
              <span
                key={cat}
                className="border-2 border-ink bg-sand px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink/70">
            <Play size={12} className="fill-crimson text-crimson" aria-hidden="true" />
            Interactive Walkthrough ({activeVideoIndex + 1}/{videos.length})
          </span>
        </div>

        {/* Portrait mobile demo stage (true 430x880 aspect ratio, zero cropping) */}
        <div className="mx-auto flex w-full flex-col items-center">
          <div className="w-full max-w-[230px] overflow-hidden rounded-xl border-2 border-ink bg-espresso shadow-brutal sm:max-w-[250px]">
            <div className="aspect-[430/880] w-full bg-espresso">
              <video
                key={activeVideo.src}
                src={activeVideo.src}
                controls
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                aria-label={`${project.title} — ${activeVideo.title}`}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <p className="mt-3 max-w-sm text-center font-mono text-xs text-ink/75">
            {activeVideo.caption}
          </p>
        </div>

        {/* Video selector tabs */}
        {videos.length > 1 && (
          <div
            role="tablist"
            aria-label={`${project.title} demo clips`}
            className="mt-4 flex flex-wrap justify-center gap-2"
          >
            {videos.map((v, idx) => {
              const selected = idx === activeVideoIndex;
              return (
                <button
                  key={v.src}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`border-2 border-ink px-2.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wide transition-[transform,box-shadow,background-color] duration-150 cursor-pointer ${
                    selected
                      ? "translate-x-[1px] translate-y-[1px] bg-crimson text-white shadow-none"
                      : "bg-sand text-ink shadow-brutal-sm hover:bg-beige"
                  }`}
                >
                  {v.title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const isUnoptimized = Boolean(project.image && /\.(svg|gif)$/i.test(project.image));

  return (
    <div className={`relative aspect-video overflow-hidden bg-beige ${borderClasses}`}>
      {project.image && (
        <Image
          src={project.image}
          alt={project.imageAlt ?? project.title}
          fill
          sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          unoptimized={isUnoptimized}
        />
      )}
      <span className="absolute top-3 left-3 border-2 border-ink bg-beige px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider">
        {project.category}
      </span>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  featured,
}: {
  project: Project;
  index: number;
  featured: boolean;
}) {
  const hasLinks = Boolean(project.liveUrl || project.repoUrl);

  return (
    <m.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 32, delay: index * 0.04 }}
      className={`group border-2 border-ink bg-sand shadow-brutal transition-shadow duration-150 hover:shadow-brutal-lg ${
        featured
          ? "md:col-span-2 grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]"
          : "flex flex-col"
      }`}
    >
      <ProjectMedia project={project} featured={featured} />

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <h3 className="text-2xl uppercase md:text-3xl">{project.title}</h3>
          <p className="mt-3 text-ink/85">{project.description}</p>

          {project.highlights && project.highlights.length > 0 && (
            <ul className="mt-5 space-y-2.5 border-t-2 border-dashed border-ink/25 pt-5 text-[0.95rem] text-ink/85">
              {project.highlights.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-orange"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
            {project.tech.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>

          {hasLinks && (
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
          )}
        </div>
      </div>
    </m.article>
  );
}

export function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = projects.filter((p) => matchesCategory(p, filter));

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
          const count = projects.filter((p) => matchesCategory(p, cat)).length;
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

      {visible.length === 0 ? (
        <div className="border-2 border-dashed border-ink/40 bg-sand/30 p-10 text-center shadow-brutal-sm">
          <p className="font-mono text-sm text-ink/75">
            No projects in <span className="font-bold text-ink">{filter}</span> yet — more case studies coming soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                featured={visible.length === 1 && Boolean(project.videos?.length)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
