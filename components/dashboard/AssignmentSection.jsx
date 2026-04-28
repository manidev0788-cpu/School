import { assignments } from "@/lib/data";
import { Card } from "@/components/ui/Card";

function AssignmentIcon({ variant }) {
  const cls = "h-8 w-8 stroke-[1.5]";
  if (variant === "book") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cls}>
        <path d="M4 19V5a2 2 0 012-2h12v18h-12a2 2 0 01-2-2z" stroke="currentColor" strokeLinejoin="round" />
        <path d="M4 19a2 2 0 002 2h12" stroke="currentColor" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === "math") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cls}>
        <path d="M9 7h6M12 4v14M8 21h8" stroke="currentColor" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cls}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" />
      <path d="M3 12h18M12 3a15 15 0 010 18" stroke="currentColor" />
    </svg>
  );
}

function AccentTint({ accent }) {
  const map = {
    emerald: "from-emerald-500/18 to-emerald-400/8 text-emerald-700",
    sky: "from-sky-500/18 to-sky-400/8 text-sky-700",
    violet: "from-violet-500/18 to-violet-400/8 text-violet-700",
  };
  return map[accent] || map.sky;
}

export default function AssignmentSection() {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Assignments</h2>
          <p className="max-w-xl text-base font-medium text-slate-500">
            Track coursework across classes — priorities surface automatically.
          </p>
        </div>
        <button
          type="button"
          className="text-base font-bold text-[#1d4ed8] transition duration-300 hover:text-[#1e40af]"
        >
          View all
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {assignments.map((a) => (
          <Card key={a.id} interactive className="group relative overflow-hidden border border-white/80 p-6">
            <div className="flex items-start justify-between gap-3">
              <div
                className={`flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-linear-to-br shadow-inner ${AccentTint({ accent: a.accent })}`}
              >
                <AssignmentIcon variant={a.icon} />
              </div>
              <div className="text-right">
                {a.badge ? (
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200/90">
                    {a.badge}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-slate-400">{a.dateLabel}</span>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-1">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-400">{a.subject}</p>
              <h3 className="text-lg font-bold leading-snug text-slate-900 transition duration-300 group-hover:text-[#1d4ed8]">
                {a.title}
              </h3>
              {a.badge ? (
                <p className="text-sm font-medium text-slate-500">{a.dateLabel}</p>
              ) : (
                <div className="pt-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-bold uppercase tracking-wide text-slate-400">
                    <span>Progress</span>
                    <span className="tabular-nums text-base font-extrabold text-slate-800">{a.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 shadow-inner">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#1d4ed8] via-sky-500 to-violet-400 shadow-[0_0_12px_rgb(29,78,216,0.35)] transition-all duration-700 group-hover:shadow-[0_0_16px_rgb(29,78,216,0.45)]"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#1d4ed8]/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          </Card>
        ))}
      </div>
    </section>
  );
}
