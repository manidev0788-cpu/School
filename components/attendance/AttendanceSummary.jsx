"use client";

import { Card } from "@/components/ui/Card";

export default function AttendanceSummary({ total, present, absent, late }) {
  const items = [
    {
      label: "Total students",
      value: total,
      tone: "border-slate-200 bg-slate-50/90 text-slate-800 ring-slate-100",
      accent: "bg-slate-400",
    },
    {
      label: "Present",
      value: present,
      tone: "border-emerald-200/90 bg-emerald-50/90 text-emerald-900 ring-emerald-100",
      accent: "bg-emerald-500",
    },
    {
      label: "Absent",
      value: absent,
      tone: "border-rose-200/90 bg-rose-50/90 text-rose-900 ring-rose-100",
      accent: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.label} className={`border px-5 py-4 ring-1 ${item.tone}`}>
            <div className="flex items-center gap-3">
              <span className={`h-10 w-1 shrink-0 rounded-full ${item.accent}`} aria-hidden />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.06em] opacity-80">{item.label}</p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {late > 0 ? (
        <p className="text-sm font-semibold text-amber-800">
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-bold text-amber-950">Late</span>{" "}
          <span className="tabular-nums">{late}</span> student{late === 1 ? "" : "s"} — counted separately from present/absent above.
        </p>
      ) : null}
    </div>
  );
}
