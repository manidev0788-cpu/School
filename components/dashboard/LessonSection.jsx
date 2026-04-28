import { lessons } from "@/lib/data";

export default function LessonSection() {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Learning tracks</h2>
          <p className="max-w-xl text-base font-medium text-slate-500">
            Curated modules for students & faculty — refreshed weekly.
          </p>
        </div>
        <button
          type="button"
          className="text-base font-bold text-[#1d4ed8] transition duration-300 hover:text-[#1e40af]"
        >
          Browse catalog
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="group">
            <div
              className={`relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br ${lesson.gradient} p-7 text-slate-900 shadow-[inset_0_1px_0_rgb(255,255,255,0.35)] ring-1 ring-white/50 transition duration-500 hover:scale-[1.015] hover:shadow-[0_24px_60px_-16px_rgb(15,23,42,0.2)]`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900/65">{lesson.subtitle}</p>
                  <h3 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h3>
                  <p className="max-w-md text-base font-medium leading-relaxed text-slate-900/85">{lesson.description}</p>
                </div>
                <span className="shrink-0 rounded-2xl bg-white/55 px-4 py-3 text-2xl shadow-md backdrop-blur-md ring-1 ring-white/70">
                  {lesson.icon === "words" ? "📖" : "🎨"}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  className="rounded-full bg-white/90 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-900 shadow-lg backdrop-blur transition duration-300 hover:bg-white"
                >
                  Open module
                </button>
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-900/60">Featured</span>
              </div>

              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-10 h-28 w-52 rounded-full bg-fuchsia-400/20 blur-3xl" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
