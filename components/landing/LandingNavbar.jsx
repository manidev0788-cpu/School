"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "#courses", label: "Courses", chevron: true },
  { href: "#timing", label: "Timing", chevron: false },
  { href: "#services", label: "Services", chevron: false },
  { href: "#home", label: "Home", chevron: false },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-100/80 px-4 py-4 sm:px-6 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <Link href="/landing" className="flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-amber-300 to-amber-400 shadow-md shadow-amber-400/40 ring-2 ring-amber-200/80">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-950" fill="currentColor" aria-hidden>
              <path d="M12 3L4 7v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V7l-8-4zm0 2.18l6 3v5.32c0 3.88-2.69 7.12-6 8.09-3.31-.97-6-4.21-6-8.09V8.18l6-3zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
            </svg>
          </span>
          <span className="hidden font-extrabold tracking-tight text-slate-800 sm:inline text-lg">E-Skool</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              {l.label}
              {l.chevron ? (
                <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              ) : null}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <label className="relative hidden min-w-0 flex-1 max-w-[200px] sm:max-w-[220px] md:block">
            <span className="sr-only">Search</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search"
              className="w-full rounded-full border border-slate-200/90 bg-slate-50/90 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none ring-[#2563eb]/0 transition placeholder:text-slate-400 focus:border-[#2563eb]/30 focus:bg-white focus:ring-4 focus:ring-[#2563eb]/12"
            />
          </label>

          <button
            type="button"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#2563eb]/25 hover:bg-slate-50 hover:text-[#2563eb]"
            aria-label="Shopping cart, 3 items"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[10px] font-bold text-white shadow-sm">
              3
            </span>
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="mt-4 flex flex-col gap-1 border-t border-slate-100 pt-4 lg:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-3 text-base font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="relative mt-2">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#2563eb]/30 focus:ring-4 focus:ring-[#2563eb]/12"
            />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
