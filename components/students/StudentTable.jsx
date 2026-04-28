"use client";

import { Card } from "@/components/ui/Card";

export default function StudentTable({ students, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Name
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Class
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Section
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Roll no.
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  No students match your search.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="transition hover:bg-[#1d4ed8]/[0.03]">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{s.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                      {s.classGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-base font-medium text-slate-700">{s.section}</td>
                  <td className="px-6 py-4 font-mono text-base font-semibold tabular-nums text-slate-800">{s.rollNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(s)}
                        className="rounded-xl border border-[#1d4ed8]/35 bg-white px-4 py-2 text-sm font-bold text-[#1d4ed8] shadow-sm transition hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(s)}
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
