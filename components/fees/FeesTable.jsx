"use client";

import { formatInr } from "@/lib/fees-data";
import { Card } from "@/components/ui/Card";

function StatusBadge({ status }) {
  const paid = status === "paid";
  const label = paid ? "Paid" : "Pending";
  const className = paid
    ? "border-emerald-300/90 bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/90 shadow-[inset_0_1px_0_rgb(255,255,255,0.6)]"
    : "border-rose-300/90 bg-rose-100 text-rose-900 ring-1 ring-rose-200/90 shadow-[inset_0_1px_0_rgb(255,255,255,0.5)]";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${className}`}>
      {label}
    </span>
  );
}

function SourceBadge({ feeSource }) {
  const auto = feeSource === "class_assignment";
  const label = auto ? "Auto" : "Manual";
  const className = auto
    ? "border-sky-300/90 bg-sky-50 text-sky-950 ring-1 ring-sky-200/90"
    : "border-slate-300/90 bg-slate-100 text-slate-800 ring-1 ring-slate-200/90";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${className}`}>{label}</span>
  );
}

function formatTableDate(iso) {
  if (!iso || typeof iso !== "string") return "—";
  try {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export default function FeesTable({ rows, onEdit, onView }) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Student name
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Class
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Amount
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Date
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Source
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Status
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  No fee records match your filters. Record a fee to get started.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-[#1d4ed8]/[0.03]">
                  <td className="px-5 py-4 font-semibold text-slate-900">{row.studentName}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                      {row.classLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold tabular-nums text-slate-800">{formatInr(row.amount)}</td>
                  <td className="px-5 py-4 text-base font-medium text-slate-700">{formatTableDate(row.paymentDate)}</td>
                  <td className="px-5 py-4">
                    <SourceBadge feeSource={row.feeSource} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="rounded-xl border border-[#1d4ed8]/40 bg-white px-4 py-2 text-sm font-bold text-[#1d4ed8] shadow-sm transition hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onView(row)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
