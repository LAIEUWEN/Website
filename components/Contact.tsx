"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check, Copy, Loader2, Send } from "lucide-react";
import { contact, profile } from "@/data/portfolioData";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "./icons";

type Status = "idle" | "sending" | "success" | "error";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[70] -translate-x-1/2">
      <AnimatePresence>
        {show && (
          <m.div
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className="flex items-center gap-2 border-2 border-ink bg-ink px-4 py-3 font-mono text-sm text-beige shadow-brutal-espresso"
          >
            <Check size={16} className="text-orange" aria-hidden="true" /> {message}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Fallback for older browsers / insecure contexts
      const el = document.createElement("textarea");
      el.value = profile.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (!WEB3FORMS_KEY) {
      // Direct email fallback: opens Gmail / default mail client with pre-filled message
      const subject = encodeURIComponent(`[Portfolio] ${data.subject || "Message"}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      
      // Open web Gmail in a new tab for seamless web mailing
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${subject}&body=${body}`;
      const mailtoUrl = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      
      const opened = window.open(gmailUrl, "_blank");
      if (!opened) {
        window.location.href = mailtoUrl;
      }
      
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          access_key: WEB3FORMS_KEY,
          from_name: `${profile.name} Portfolio`,
          subject: `[Portfolio] ${data.subject}`,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const socials = [
    { label: "GitHub", href: profile.socials.github, icon: <GithubIcon size={22} /> },
    { label: "LinkedIn", href: profile.socials.linkedin, icon: <LinkedinIcon size={22} /> },
    { label: "WhatsApp", href: profile.socials.whatsapp, icon: <WhatsappIcon size={22} /> },
  ];

  return (
    <section id="contact" className="relative overflow-hidden border-b-2 border-ink">
      {/* Radiant ambient section highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-20 h-[36rem] w-[36rem] rounded-full opacity-44 blur-[115px] dark:opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(225, 65, 35, 0.85) 0%, rgba(245, 140, 50, 0.45) 45%, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-20 h-[34rem] w-[34rem] rounded-full opacity-40 blur-[110px] dark:opacity-45"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 195, 60, 0.85) 0%, rgba(232, 111, 44, 0.38) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid overflow-hidden border-[3px] border-ink shadow-brutal-lg lg:grid-cols-2">
          {/* Left: direct action */}
          <div className="relative flex flex-col justify-between gap-10 border-b-[3px] border-ink bg-crimson p-8 text-white md:p-12 lg:border-r-[3px] lg:border-b-0">
            <div>
              <p className="section-eyebrow mb-6 text-white">
                <span className="border-2 border-ink bg-beige px-1.5 py-0.5 text-ink">06</span>
                Contact
              </p>
              <h2 className="font-display text-5xl leading-[0.95] font-extrabold uppercase tracking-[-0.03em] md:text-6xl xl:text-7xl">
                {contact.headline}
              </h2>
              <p className="mt-6 max-w-md text-lg text-white">{contact.blurb}</p>
            </div>

            <div className="space-y-6">
              <button
                type="button"
                onClick={copyEmail}
                className="brutal-btn btn-beige w-full justify-between text-base normal-case sm:w-auto"
                aria-label={`Copy email address ${profile.email}`}
              >
                <span className="font-mono text-sm tracking-normal">{profile.email}</span>
                <span className="inline-flex items-center gap-1.5 border-l-2 border-ink pl-3 uppercase">
                  {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>

              <ul className="flex gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid h-12 w-12 place-items-center border-2 border-ink bg-beige text-ink shadow-brutal transition-[transform,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-orange hover:shadow-brutal-sm"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={onSubmit} className="space-y-5 bg-sand p-8 md:p-12" noValidate={false}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block font-mono text-xs font-medium uppercase tracking-widest">
                  Name
                </label>
                <input id="name" name="name" required autoComplete="name" className="input-brutal" placeholder="Heisenberg" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block font-mono text-xs font-medium uppercase tracking-widest">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input-brutal"
                  placeholder="ILoveMath@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-2 block font-mono text-xs font-medium uppercase tracking-widest">
                Subject
              </label>
              <input id="subject" name="subject" required className="input-brutal" placeholder="Let's start cooking" />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block font-mono text-xs font-medium uppercase tracking-widest">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="input-brutal resize-y"
                placeholder="Tell me about your project, role, or idea…"
              />
            </div>
            {/* Honeypot for bots */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <button type="submit" disabled={status === "sending"} className="brutal-btn btn-ink w-full text-base disabled:opacity-70">
              {status === "sending" ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…
                </>
              ) : (
                <>
                  Send Message <Send size={18} aria-hidden="true" />
                </>
              )}
            </button>

            <div aria-live="polite" className="min-h-6 font-mono text-sm">
              {status === "success" && (
                <p className="border-2 border-ink bg-beige px-3 py-2">✅ Message sent — I&apos;ll get back to you soon!</p>
              )}
              {status === "error" && (
                <p className="border-2 border-crimson bg-beige px-3 py-2">
                  ⚠️ {error} You can also email me directly at {profile.email}.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
      <Toast show={copied} message="Copied! Email address is on your clipboard." />
    </section>
  );
}
