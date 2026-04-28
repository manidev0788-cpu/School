"use client";

import { classDisplayName } from "@/lib/classes-data";
import { Card } from "@/components/ui/Card";

export default function ClassTable({ rows, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Class name
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Section
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Total students
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Class teacher
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  No classes match your search or filter.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-[#1d4ed8]/[0.03]">
                  <td className="px-5 py-4">
                    <span className="text-lg font-bold tracking-tight text-slate-900">{classDisplayName(row)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-800">
                      {row.section}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="tabular-nums text-base font-semibold text-slate-800">{row.totalStudents}</span>
                  </td>
                  <td className="px-5 py-4 text-base font-medium text-slate-700">
                    {row.classTeacher ? (
                      <span className="rounded-full bg-[#1d4ed8]/8 px-3 py-1 text-sm font-semibold text-[#1d4ed8] ring-1 ring-[#1d4ed8]/15">
                        {row.classTeacher}
                      </span>
                    ) : (
                      <span className="text-sm font-medium italic text-slate-400">Unassigned</span>
                    )}
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
                        onClick={() => onDelete(row)}
                        className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
                      >
                        Delete
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
