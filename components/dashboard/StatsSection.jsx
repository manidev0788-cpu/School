import { dashboardStats } from "@/lib/data";
import { Card } from "@/components/ui/Card";

function StatIcon({ name }) {
  const cls = "h-7 w-7";
  if (name === "users") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 7a3 3 0 100-6 3 3 0 000 6zm8 13v-2a4 4 0 00-3-3.87" />
      </svg>
    );
  }
  if (name === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3 3 7-7M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
      </svg>
    );
  }
  if (name === "coin") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10v6M12 3 2 8l10 5 10-5-10-5zM6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

const toneStyles = {
  blue: {
    mesh: "from-[#1d4ed8]/14 via-sky-400/12 to-transparent",
    icon: "text-[#1d4ed8]",
  },
  yellow: {
    mesh: "from-amber-400/28 via-yellow-200/40 to-transparent",
    icon: "text-amber-800",
  },
  pink: {
    mesh: "from-fuchsia-400/22 via-pink-200/45 to-transparent",
    icon: "text-pink-700",
  },
  purple: {
    mesh: "from-violet-500/22 via-purple-200/40 to-transparent",
    icon: "text-violet-800",
  },
};

export default function StatsSection() {
  return (
    <section aria-label="School overview statistics">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((s) => {
          const tone = toneStyles[s.tone] || toneStyles.blue;
          return (
            <Card key={s.id} interactive className="group relative overflow-hidden border border-white/70 p-6">
              <div
                className={`pointer-events-none absolute inset-0 bg-linear-to-br opacity-95 transition duration-500 group-hover:opacity-100 ${tone.mesh}`}
              />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex rounded-xl bg-white/85 p-2.5 shadow-sm ring-1 ring-white/70 backdrop-blur-sm ${tone.icon}`}
                  >
                    <StatIcon name={s.icon} />
                  </span>
                  <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 ring-1 ring-slate-200/90">
                    Live
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{s.label}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[1.85rem]">{s.value}</p>
                  <p className="mt-1.5 text-sm font-medium text-slate-600">{s.hint}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
