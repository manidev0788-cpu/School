"use client";

import { Card } from "@/components/ui/Card";
import StatusToggleGroup from "@/components/attendance/StatusToggleGroup";

function rowTone(status) {
  if (status === "absent") return "bg-rose-50/75 hover:bg-rose-50 border-l-[3px] border-l-rose-400";
  return "bg-emerald-50/55 hover:bg-emerald-50/90 border-l-[3px] border-l-emerald-400";
}

export default function AttendanceTable({ students, marks, onChange }) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Name
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Roll number
              </th>
              <th scope="col" className="min-w-[280px] whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => {
              const status = marks[s.id] ?? "present";
              return (
                <tr key={s.id} className={`transition ${rowTone(status)}`}>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{s.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-base font-semibold tabular-nums text-slate-800">{s.rollNo}</td>
                  <td className="px-6 py-4">
                    <StatusToggleGroup
                      value={status}
                      onChange={(next) => onChange(s.id, next)}
                      namePrefix={`att-${s.id}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
