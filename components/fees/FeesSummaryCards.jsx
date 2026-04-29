"use client";

import { Card } from "@/components/ui/Card";
import { formatInr } from "@/lib/fees-data";

export default function FeesSummaryCards({ totalCollected, totalPending, recordCount }) {
  const items = [
    {
      label: "Total fees collected",
      value: formatInr(totalCollected),
      tone: "border-emerald-200/90 bg-emerald-50/90 text-emerald-950 ring-emerald-100",
      accent: "bg-emerald-500",
    },
    {
      label: "Total pending fees",
      value: formatInr(totalPending),
      tone: "border-rose-200/90 bg-rose-50/90 text-rose-950 ring-rose-100",
      accent: "bg-rose-500",
    },
    {
      label: "Records (filtered)",
      value: String(recordCount),
      tone: "border-slate-200 bg-slate-50/90 text-slate-900 ring-slate-100",
      accent: "bg-[#1d4ed8]",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className={`border px-5 py-5 ring-1 ${item.tone}`}>
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-10 w-1 shrink-0 rounded-full ${item.accent}`} aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.06em] opacity-85">{item.label}</p>
              <p className="mt-2 text-2xl font-extrabold tracking-tight tabular-nums">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
