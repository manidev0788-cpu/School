import LogoutButton from "@/components/auth/LogoutButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 px-7 py-4 backdrop-blur-xl xl:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-5">
        <div className="relative flex min-w-[200px] max-w-xl flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </span>
          <label htmlFor="dashboard-search" className="sr-only">
            Search students, classes, or records
          </label>
          <input
            id="dashboard-search"
            type="search"
            placeholder="Search classes, students, or announcements…"
            className="w-full rounded-full border border-slate-200/90 bg-white py-3.5 pl-14 pr-5 text-base font-medium text-slate-800 shadow-inner shadow-slate-100/80 outline-none ring-[#1d4ed8]/0 transition duration-300 placeholder:font-normal placeholder:text-slate-400 focus:border-[#1d4ed8]/35 focus:bg-white focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <LogoutButton />

          <button
            type="button"
            className="relative rounded-2xl border border-slate-200/90 bg-white p-3 text-slate-600 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1d4ed8]/25 hover:text-[#1d4ed8] hover:shadow-md"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.75">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white py-2 pl-2 pr-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#1d4ed8]/20 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
            aria-label="Account menu"
          >
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#1d4ed8] to-sky-500 text-base font-bold text-white shadow-md shadow-blue-500/35">
              KR
              <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-emerald-950 ring-2 ring-white">
                Pro
              </span>
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-base font-semibold leading-tight text-slate-900">Kate Rivera</span>
              <span className="mt-1 block text-sm font-semibold uppercase tracking-wide text-slate-500">
                Lead teacher · Grade 8
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
