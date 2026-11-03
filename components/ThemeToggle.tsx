"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial preference from localStorage or system theme
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="grid h-10 w-10 place-items-center border-2 border-ink bg-beige shadow-brutal-sm">
        <span className="h-5 w-5" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="grid h-10 w-10 place-items-center border-2 border-ink bg-beige text-ink shadow-brutal-sm transition-[transform,box-shadow,background-color] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-sand"
    >
      {theme === "light" ? (
        <Moon size={18} strokeWidth={2.5} className="text-ink" />
      ) : (
        <Sun size={18} strokeWidth={2.5} className="text-orange" />
      )}
    </button>
  );
}
