"use client";

import { Card } from "@/components/ui/Card";
import StudentAvatar from "@/components/students/StudentAvatar";
import { formatInr } from "@/lib/fees-data";

export default function StudentTable({
  students,
  totalCount = 0,
  loading = false,
  configured = true,
  assignmentFees = {},
  onViewProfile,
  onEdit,
  onDelete,
}) {
  const showTuitionCol = configured;

  const showEmptySearch = !loading && configured && totalCount > 0 && students.length === 0;
  const showEmptyList = !loading && configured && totalCount === 0;
  const showConfigHint = !loading && !configured;

  const colSpan = showTuitionCol ? 6 : 5;

  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Student
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
              {showTuitionCol && (
                <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                  Tuition
                </th>
              )}
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  Loading students…
                </td>
              </tr>
            ) : showConfigHint ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  Connect Supabase by setting env vars in .env.local — student rows will appear here after you restart the dev server.
                </td>
              </tr>
            ) : showEmptyList ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  No students yet. Use &quot;Add student&quot; to create your first record.
                </td>
              </tr>
            ) : showEmptySearch ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  No students match your search.
                </td>
              </tr>
            ) : (
              students.map((s) => {
                const assign = assignmentFees[s.id];
                const recordTuition =
                  typeof s.tuition === "number" && Number.isFinite(s.tuition) && s.tuition > 0 ? s.tuition : null;
                const displayAmount = recordTuition ?? (assign ? assign.amount : null);
                return (
                  <tr key={s.id} className="transition hover:bg-[#1d4ed8]/[0.03]">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <StudentAvatar name={s.name} imageUrl={s.profileImage} size="sm" className="shrink-0 shadow-sm" />
                        <div className="flex min-w-0 flex-col gap-2">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          {s.studentId?.trim() ? (
                            <span className="inline-flex shrink-0 items-center rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide text-slate-800 shadow-sm ring-1 ring-slate-200/90">
                              [{s.studentId}]
                            </span>
                          ) : null}
                          <span className="text-lg font-bold leading-snug text-slate-900">{s.name?.trim() ? s.name : "—"}</span>
                        </div>
                        {s.famousLandmark?.trim() ? (
                          <span className="max-w-[260px] text-xs font-medium leading-snug text-slate-500" title={s.famousLandmark}>
                            {s.famousLandmark}
                          </span>
                        ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                        {s.classGrade?.trim() ? s.classGrade : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-base font-medium text-slate-700">{s.section?.trim() ? s.section : "—"}</td>
                    <td className="px-6 py-4 font-mono text-base font-semibold tabular-nums text-slate-800">{s.rollNo?.trim() ? s.rollNo : "—"}</td>
                    {showTuitionCol && (
                      <td className="px-6 py-4">
                        {displayAmount != null ? (
                          <span className="inline-flex flex-col gap-0.5">
                            <span className="tabular-nums text-sm font-bold text-slate-900">{formatInr(displayAmount)}</span>
                            {assign ? (
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wide ${
                                  assign.status === "paid" ? "text-emerald-700" : "text-rose-700"
                                }`}
                              >
                                {assign.status === "paid" ? "Paid" : "Pending"}
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">On record</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-slate-400">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewProfile?.(s)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:border-[#1d4ed8]/35 hover:bg-slate-50"
                        >
                          View Profile
                        </button>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
