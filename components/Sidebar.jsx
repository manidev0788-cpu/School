"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarNav } from "@/lib/data";
import { NavIcon } from "@/components/icons/NavIcons";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col overflow-hidden border-r border-white/10 bg-linear-to-b from-[#0f3d91] via-[#1d4ed8] to-[#1e40af] px-4 pb-8 pt-8 text-white shadow-[12px_0_48px_-12px_rgb(30,58,138,0.45)]">
      <div className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative mb-11 flex items-center gap-3.5 px-2">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 shadow-inner ring-2 ring-amber-300/80 ring-offset-2 ring-offset-transparent">
          <span className="text-xl font-extrabold tracking-tight text-amber-300">E</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/90">School ERP</p>
          <p className="text-xl font-bold tracking-tight">E-Skool</p>
        </div>
      </div>

      <nav className="relative flex flex-1 flex-col gap-1.5">
        {sidebarNav.map((item) => {
          const isHash = item.href.startsWith("#");
          const active =
            !isHash && (pathname === item.href || pathname.startsWith(`${item.href}/`));

          const base =
            "group relative flex items-center gap-3 overflow-visible rounded-xl px-3 py-3.5 text-[15px] font-semibold tracking-wide transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";
          const inactive =
            "text-blue-50/90 hover:bg-white/10 hover:pl-4 hover:text-white hover:shadow-lg hover:shadow-black/10";
          const activeCls =
            "bg-white text-[#1d4ed8] shadow-xl shadow-blue-950/30 ring-1 ring-white/40 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-amber-300";

          const content = (
            <>
              <span
                className={`rounded-xl p-2.5 transition-all duration-300 ${active ? "bg-[#eff6ff] text-[#1d4ed8]" : "bg-white/5 text-blue-100 group-hover:bg-white/15 group-hover:text-white"}`}
              >
                <NavIcon name={item.icon} />
              </span>
              <span className="truncate">{item.label}</span>
            </>
          );

          if (isHash) {
            return (
              <a key={item.id} href={item.href} className={`${base} ${inactive}`}>
                {content}
              </a>
            );
          }

          return (
            <Link key={item.id} href={item.href} className={`${base} ${active ? activeCls : inactive}`}>
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-auto rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-4 backdrop-blur-md transition hover:bg-white/10">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-100/80">Academic term</p>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold text-amber-200">S2 · 3</span>
        </div>
        <p className="mt-2 text-base font-medium text-white">Semester 2 of 3</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/25">
          <div
            className="h-full rounded-full bg-linear-to-r from-amber-300 via-yellow-200 to-amber-100 shadow-[0_0_12px_rgb(251,191,36,0.5)] transition-all duration-700"
            style={{ width: "66%" }}
          />
        </div>
      </div>
    </aside>
  );
}
