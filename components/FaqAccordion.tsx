"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import { faq } from "@/data/portfolioData";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="space-y-4">
      {faq.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <li key={item.question} className="border-2 border-ink bg-sand shadow-brutal">
            <h3 className="font-sans text-base tracking-normal">
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-display text-lg font-bold transition-colors duration-150 md:px-7 md:text-xl ${
                  open ? "bg-orange" : "hover:bg-beige"
                }`}
              >
                <span>{item.question}</span>
                <m.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="grid h-9 w-9 shrink-0 place-items-center border-2 border-ink bg-beige"
                  aria-hidden="true"
                >
                  <Plus size={20} strokeWidth={2.75} />
                </m.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  className="overflow-hidden"
                >
                  <p className="border-t-2 border-ink px-5 py-5 text-ink/90 md:px-7">{item.answer}</p>
                </m.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
