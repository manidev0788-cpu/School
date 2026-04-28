"use client";

import { Card } from "@/components/ui/Card";
import { gradeBadgeTone, gradeLetter, percentageFromRow, sumMarks } from "@/lib/results-data";

export default function ResultsTable({ rows, onEdit }) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                Student name
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                Roll no.
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                Math
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                English
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                Science
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                Total
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                %
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                Grade
              </th>
              <th scope="col" className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.06em] text-slate-500 sm:px-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  No results for these filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const total = sumMarks(row);
                const pct = percentageFromRow(row);
                const letter = gradeLetter(pct);
                const top = pct >= 90;
                return (
                  <tr
                    key={row.id}
                    className={`transition hover:bg-[#1d4ed8]/[0.03] ${top ? "border-l-4 border-emerald-400 bg-emerald-50/40" : ""}`}
                  >
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">{row.studentName}</span>
                        {top ? (
                          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Top
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm font-semibold tabular-nums text-slate-800 sm:px-5">{row.rollNo}</td>
                    <td className="px-4 py-4 tabular-nums text-sm font-semibold text-slate-800 sm:px-5">{row.math}</td>
                    <td className="px-4 py-4 tabular-nums text-sm font-semibold text-slate-800 sm:px-5">{row.english}</td>
                    <td className="px-4 py-4 tabular-nums text-sm font-semibold text-slate-800 sm:px-5">{row.science}</td>
                    <td className="px-4 py-4 tabular-nums text-sm font-bold text-slate-900 sm:px-5">{total}</td>
                    <td className="px-4 py-4 tabular-nums text-sm font-bold text-[#1d4ed8] sm:px-5">{pct}</td>
                    <td className="px-4 py-4 sm:px-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${gradeBadgeTone(letter)}`}
                      >
                        {letter}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="rounded-xl border border-[#1d4ed8]/40 bg-white px-4 py-2 text-sm font-bold text-[#1d4ed8] shadow-sm transition hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5"
                      >
                        Edit
                      </button>
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
