import Image from "next/image";
import { welcomeProfile } from "@/lib/data";
import { Card } from "@/components/ui/Card";

export default function WelcomeCard() {
  const p = welcomeProfile;

  return (
    <Card className="relative overflow-hidden border border-white/60 p-6 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-white via-[#f8fafc] to-[#eff6ff]/90" />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-linear-to-br from-[#1d4ed8]/12 via-sky-300/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-linear-to-tr from-amber-200/40 via-pink-100/30 to-transparent blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-xl space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#1d4ed8]/90">{p.eyebrow}</p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-[2.35rem] sm:leading-[1.15]">
                Hi, {p.name.split(" ")[0]}
              </h1>
              <span className="rounded-full bg-[#1d4ed8]/8 px-3 py-1.5 text-sm font-semibold text-[#1d4ed8] ring-1 ring-[#1d4ed8]/15">
                {p.role}
              </span>
            </div>
          </div>

          <p className="text-xl font-semibold leading-snug text-slate-800">{p.headline}</p>

          <p className="text-base leading-relaxed text-slate-600">
            You&apos;ve completed{" "}
            <strong className="font-bold text-[#1d4ed8]">{p.progressPercent}%</strong> of weekly learning targets and cleared{" "}
            <strong className="font-bold text-slate-900">{p.submissionsCleared}</strong> submissions. {p.bodyLead}
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-amber-400 to-yellow-300 px-7 py-3.5 text-base font-bold text-slate-900 shadow-[0_8px_28px_-6px_rgb(251,191,36,0.55)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-6px_rgb(251,191,36,0.65)]"
            >
              {p.cta}
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200/90 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition duration-300 hover:border-[#1d4ed8]/25 hover:text-[#1d4ed8]"
            >
              View roster
            </button>
          </div>
        </div>

        <div className="relative mx-auto flex h-52 w-full max-w-[300px] shrink-0 items-center justify-center lg:mx-0 lg:h-56 lg:w-[320px]">
          <div className="absolute inset-2 rounded-[2rem] bg-linear-to-br from-blue-50 via-white to-violet-50 shadow-inner ring-1 ring-slate-100/80" />
          <div className="relative h-44 w-52 sm:h-48 sm:w-60">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80"
              alt=""
              fill
              sizes="(max-width: 1024px) 300px, 360px"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          <span className="absolute right-4 top-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-amber-300 to-yellow-200 text-lg shadow-lg ring-2 ring-white">
            💡
          </span>
          <span className="absolute bottom-10 left-6 inline-flex h-10 w-10 -rotate-12 items-center justify-center rounded-2xl bg-white text-lg shadow-lg ring-1 ring-slate-100">
            ✈️
          </span>
        </div>
      </div>
    </Card>
  );
}
