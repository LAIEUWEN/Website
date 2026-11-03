import { ArrowUp } from "lucide-react";
import { navLinks, profile } from "@/data/portfolioData";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-ink bg-espresso text-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-display text-2xl font-bold uppercase tracking-[-0.03em]">{profile.name}</p>
          <p className="mt-1 font-mono text-xs opacity-80">
            © {year} {profile.name}. Built with Next.js, Tailwind & too much coffee.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-widest">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="underline-offset-4 hover:text-orange hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#top"
          data-back-to-top
          aria-label="Back to top"
          className="inline-flex items-center gap-2 self-start border-2 border-ink bg-beige px-4 py-2 font-display text-sm font-bold uppercase tracking-wide text-ink shadow-[4px_4px_0_#E86F2C] transition-[transform,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#E86F2C] md:self-auto cursor-pointer select-none"
        >
          Back to Top <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
