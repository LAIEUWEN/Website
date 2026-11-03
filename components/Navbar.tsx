"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "@/data/portfolioData";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape and lock scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-beige/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a
          href="#top"
          className="group flex items-center gap-3"
          aria-label={`${profile.name} — back to top`}
        >
          <span className="grid h-10 w-10 place-items-center border-2 border-ink bg-crimson font-display text-base font-bold text-white shadow-brutal-sm transition-transform duration-150 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none">
            {profile.monogram}
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight sm:inline">
            {profile.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative px-3 py-2 font-display text-sm font-bold uppercase tracking-wide after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-crimson after:transition-transform after:duration-200 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="ml-3 flex items-center gap-2">
            <ThemeToggle />
            <a href="#contact" className="brutal-btn btn-crimson py-2">
              Contact Me
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center border-2 border-ink bg-beige shadow-brutal-sm"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="overflow-hidden border-t-2 border-ink bg-beige md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-2 border-transparent px-3 py-3 font-display text-lg font-bold uppercase hover:border-ink hover:bg-sand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="brutal-btn btn-crimson w-full"
                >
                  Contact Me
                </a>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
