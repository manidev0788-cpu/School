import { calendar, tasksToday } from "@/lib/data";
import { Card } from "@/components/ui/Card";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DashboardRightSidebar() {
  const cells = [];
  const { startWeekday, daysInMonth, today, month, year } = calendar;

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({ key: `pad-${i}`, day: null });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ key: `day-${d}`, day: d });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `trail-${cells.length}`, day: null });
  }

  return (
    <aside className="flex w-full flex-col gap-6 xl:w-[340px] xl:shrink-0">
      <Card className="relative overflow-hidden border border-white/80 p-6">
        <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-linear-to-br from-[#1d4ed8]/15 to-transparent blur-3xl" />

        <div className="relative flex items-center justify-between gap-3">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#1d4ed8]"
            aria-label="Previous month"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Calendar</p>
            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
              {month} {year}
            </h3>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#1d4ed8]"
            aria-label="Next month"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="relative mt-6 grid grid-cols-7 gap-y-1 text-center text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-2">
              {d}
            </span>
          ))}
        </div>

        <div className="relative mt-2 grid grid-cols-7 gap-2 text-center text-base">
          {cells.map((c) => {
            if (c.day === null) {
              return <span key={c.key} className="h-11" />;
            }
            const isToday = c.day === today;
            return (
              <span
                key={c.key}
                className={`inline-flex h-11 w-11 items-center justify-center justify-self-center rounded-xl text-base font-semibold transition duration-300 ${
                  isToday
                    ? "bg-linear-to-br from-[#1d4ed8] to-sky-500 text-white shadow-lg shadow-blue-500/35 ring-2 ring-[#1d4ed8]/30"
                    : "text-slate-700 hover:bg-slate-100 hover:shadow-inner"
                }`}
              >
                {c.day}
              </span>
            );
          })}
        </div>
      </Card>

      <Card className="border border-white/80 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Operations</p>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Today&apos;s focus</h3>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-full border border-[#1d4ed8]/35 bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#1d4ed8] shadow-sm transition duration-300 hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5"
          >
            Add task
          </button>
        </div>

        <ul className="mt-6 space-y-2">
          {tasksToday.map((task) => (
            <li
              key={task.id}
              className={`group flex items-start gap-3 rounded-xl px-3 py-3 transition duration-300 ${
                task.highlighted
                  ? "bg-linear-to-r from-sky-50 to-indigo-50/80 shadow-inner ring-1 ring-sky-100/90"
                  : "hover:bg-slate-50"
              }`}
            >
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${task.dot}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className={`text-base leading-snug ${task.highlighted ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                  {task.label}
                </p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-400">{task.meta}</p>
              </div>
              <span className="opacity-0 transition group-hover:opacity-100">
                <svg className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="relative overflow-hidden border border-violet-100/90 bg-linear-to-br from-violet-50/90 via-white to-pink-50/40 p-6">
        <div className="relative z-10 flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#1d4ed8]/15 to-fuchsia-400/25 text-2xl shadow-inner ring-1 ring-white/80">
            📢
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-900">Whole-school bulletin</p>
            <p className="text-sm font-medium leading-relaxed text-slate-600">
              Annual day rehearsals · Block C gym · Fri 4:30 PM. Parents invited via portal.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 top-0 h-28 w-28 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </Card>
    </aside>
  );
}
