"use client";

import { feeDue, feeStatus, formatInr } from "@/lib/fees-data";
import { Card } from "@/components/ui/Card";

function StatusBadge({ status }) {
  const map = {
    paid: {
      label: "Paid",
      className:
        "border-emerald-300/90 bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/90 shadow-[inset_0_1px_0_rgb(255,255,255,0.6)]",
    },
    unpaid: {
      label: "Unpaid",
      className:
        "border-rose-300/90 bg-rose-100 text-rose-900 ring-1 ring-rose-200/90 shadow-[inset_0_1px_0_rgb(255,255,255,0.5)]",
    },
    partial: {
      label: "Partial",
      className:
        "border-amber-300/90 bg-amber-100 text-amber-950 ring-1 ring-amber-200/90 shadow-[inset_0_1px_0_rgb(255,255,255,0.5)]",
    },
  };
  const cfg = map[status] || map.unpaid;
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function FeesTable({ rows, onPay, onView }) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Student name
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Class
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Total fees
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Paid amount
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Due amount
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
                  No fee records match your filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const due = feeDue(row);
                const status = feeStatus(row);
                const canPay = due > 0;
                return (
                  <tr key={row.id} className="transition hover:bg-[#1d4ed8]/[0.03]">
                    <td className="px-5 py-4 font-semibold text-slate-900">{row.studentName}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                        {row.classLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold tabular-nums text-slate-800">{formatInr(row.totalFees)}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums text-emerald-800">{formatInr(row.paidAmount)}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums text-rose-800">{formatInr(due)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={!canPay}
                          onClick={() => canPay && onPay(row)}
                          className={`rounded-xl border px-4 py-2 text-sm font-bold shadow-sm transition ${
                            canPay
                              ? "border-[#1d4ed8]/40 bg-white text-[#1d4ed8] hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5"
                              : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                          }`}
                        >
                          Pay fees
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
