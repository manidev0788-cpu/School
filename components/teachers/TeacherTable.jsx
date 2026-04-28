"use client";

import { Card } from "@/components/ui/Card";

export default function TeacherTable({ rows, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Name
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Subject
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Assigned class
              </th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-sm font-bold uppercase tracking-[0.06em] text-slate-500">
                Phone / Email
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
                  No teachers match your search or filters.
                </td>
              </tr>
            ) : (
              rows.map((t) => (
                <tr key={t.id} className="transition hover:bg-[#1d4ed8]/[0.03]">
                  <td className="px-5 py-4 font-semibold text-slate-900">{t.name}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-lg bg-[#1d4ed8]/8 px-2.5 py-1 text-sm font-semibold text-[#1d4ed8] ring-1 ring-[#1d4ed8]/15">
                      {t.subject}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-base font-medium text-slate-800">{t.assignedClass}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="font-mono font-semibold tabular-nums text-slate-800">{t.phone}</span>
                      <span className="break-all font-medium text-[#1d4ed8]">{t.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(t)}
                        className="rounded-xl border border-[#1d4ed8]/40 bg-white px-4 py-2 text-sm font-bold text-[#1d4ed8] shadow-sm transition hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(t)}
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
