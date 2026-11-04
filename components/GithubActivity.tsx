import { ArrowUpRight, GitCommitHorizontal, Star, Users, BookMarked } from "lucide-react";
import { getGithubData, type ContributionDay, type RepoSummary } from "@/lib/github";
import { SectionHeader } from "./SectionHeader";
import { GithubIcon } from "./icons";

const LEVEL_CLASSES = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function ContributionGraph({ weeks, total }: { weeks: ContributionDay[][]; total: number | null }) {
  // Month labels: show a label above the first week that contains the 1st–7th of a month.
  const monthLabels = weeks.map((week, i) => {
    const first = week[0];
    if (!first) return null;
    const d = new Date(`${first.date}T00:00:00Z`);
    const prev = weeks[i - 1]?.[0];
    const prevMonth = prev ? new Date(`${prev.date}T00:00:00Z`).getUTCMonth() : -1;
    return d.getUTCMonth() !== prevMonth ? MONTHS[d.getUTCMonth()] : null;
  });

  const summary =
    total !== null
      ? `${total.toLocaleString("en-US")} contributions in the last year`
      : "Contribution calendar";

  return (
    <div className="brutal-card bg-beige p-5 md:p-7">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl uppercase md:text-2xl">Commit Calendar</h3>
        <p className="font-mono text-sm">
          {total !== null ? (
            <>
              <span className="font-bold">{total.toLocaleString("en-US")}</span> contributions / last
              12 months
            </>
          ) : (
            "Live data temporarily unavailable"
          )}
        </p>
      </div>

      {/* dir=rtl keeps the most recent weeks visible on narrow screens */}
      <div className="overflow-x-auto pb-2" dir="rtl">
        <div dir="ltr" className="inline-block min-w-max" role="img" aria-label={summary}>
          <div className="mb-1.5 flex gap-[3px] pl-[35px] font-mono text-[10px] text-ink/70" aria-hidden="true">
            {monthLabels.map((label, i) => (
              <span key={i} className="w-[11px] overflow-visible whitespace-nowrap md:w-[13px]">
                {label ?? ""}
              </span>
            ))}
          </div>
          <div className="flex gap-[3px]" aria-hidden="true">
            <div className="mr-1 flex w-7 flex-col gap-[3px] font-mono text-[10px] text-ink/70">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                <span key={i} className="h-[11px] leading-[11px] md:h-[13px] md:leading-[13px]">
                  {d}
                </span>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className={`flex flex-col gap-[3px] ${wi === 0 ? "justify-end" : "justify-start"}`}
              >
                {week.map((day) => (
                  <span
                    key={day.date}
                    title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                    className={`block h-[11px] w-[11px] border border-ink/25 md:h-[13px] md:w-[13px] ${LEVEL_CLASSES[day.level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 font-mono text-[11px] text-ink/70" aria-hidden="true">
        Less
        {LEVEL_CLASSES.map((c) => (
          <span key={c} className={`h-3 w-3 border border-ink/25 ${c}`} />
        ))}
        More
      </div>
    </div>
  );
}

function RepoCard({ repo }: { repo: RepoSummary }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col border-2 border-ink bg-sand p-5 shadow-brutal transition-[transform,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="flex items-center gap-2 font-mono text-base font-medium tracking-normal break-all">
          <BookMarked size={16} aria-hidden="true" className="shrink-0" />
          {repo.name}
        </h4>
        <ArrowUpRight
          size={18}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-sm text-ink/80">
        {repo.description ?? "No description provided."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t-2 border-dashed border-ink/25 pt-3 font-mono text-xs">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full border border-ink"
              style={{ backgroundColor: repo.languageColor ?? "#E86F2C" }}
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1" aria-label={`${repo.stars} stars`}>
          <Star size={13} aria-hidden="true" /> {repo.stars.toLocaleString("en-US")}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitCommitHorizontal size={13} aria-hidden="true" /> {timeAgo(repo.updatedAt)}
        </span>
      </div>
    </a>
  );
}

export async function GithubActivity() {
  const data = await getGithubData();

  const stats = [
    { icon: GitCommitHorizontal, label: "Contributions", value: data.totalContributions },
    { icon: BookMarked, label: "Public Repos", value: data.publicRepos },
    { icon: Users, label: "Followers", value: data.followers },
  ];

  return (
    <section id="github" className="relative overflow-hidden border-b-2 border-ink bg-sand/40">
      {/* Radiant ambient section highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-20 h-[34rem] w-[34rem] rounded-full opacity-42 blur-[110px] dark:opacity-48"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 195, 60, 0.85) 0%, rgba(232, 111, 44, 0.4) 45%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-20 h-[32rem] w-[32rem] rounded-full opacity-38 blur-[110px] dark:opacity-44"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 140, 50, 0.8) 0%, rgba(217, 56, 30, 0.35) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <SectionHeader
          index="03"
          eyebrow={`github.com/${data.username}`}
          title="Live GitHub Activity"
          description="Pulled straight from the GitHub API and refreshed every hour."
          action={
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn btn-ink"
            >
              <GithubIcon size={18} /> Full Profile <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          }
        />

        <div className="mb-6 grid grid-cols-3 gap-3 md:gap-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="border-2 border-ink bg-beige p-3 shadow-brutal-sm md:p-5">
              <Icon size={18} aria-hidden="true" className="mb-2" />
              <p className="font-display text-2xl font-bold md:text-4xl">
                {value !== null ? value.toLocaleString("en-US") : "—"}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink/70 md:text-xs">
                {label}
              </p>
            </div>
          ))}
        </div>

        <ContributionGraph weeks={data.weeks} total={data.totalContributions} />

        {data.repos.length > 0 && (
          <div className="mt-10">
            <p className="section-eyebrow mb-4">
              <span className="h-2 w-2 bg-crimson" aria-hidden="true" />
              {data.repoLabel} Repositories
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {data.repos.map((repo) => (
                <RepoCard key={repo.name} repo={repo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
