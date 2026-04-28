import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default function PortalShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="erp-page-bg min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4 xl:px-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#1d4ed8] to-indigo-700 text-lg font-extrabold text-white shadow-md shadow-blue-500/30">
                E
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
                <p className="text-lg font-extrabold tracking-tight text-slate-900">E-Skool</p>
              </div>
            </Link>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-10 xl:px-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-base font-medium text-slate-500">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
