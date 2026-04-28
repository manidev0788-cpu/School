"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { INITIAL_ACTIVITY_LOGS } from "@/lib/activity-logs-data";
import { readLogs } from "@/lib/admin-persistence";

function actionBadge(action) {
  switch (action) {
    case "Add":
      return "bg-sky-50 text-sky-900 ring-sky-100";
    case "Edit":
      return "bg-violet-50 text-violet-900 ring-violet-100";
    case "Delete":
      return "bg-rose-50 text-rose-900 ring-rose-100";
    case "Restore":
      return "bg-emerald-50 text-emerald-900 ring-emerald-100";
    case "Reset":
      return "bg-amber-50 text-amber-950 ring-amber-100";
    default:
      return "bg-slate-50 text-slate-800 ring-slate-100";
  }
}

function formatWhen(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function ActivityLogsPageClient() {
  const [logs, setLogs] = useState(INITIAL_ACTIVITY_LOGS);

  const refresh = () => {
    setLogs(readLogs(INITIAL_ACTIVITY_LOGS));
  };

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("eskool-logs-updated", onUpdate);
    window.addEventListener("focus", onUpdate);
    return () => {
      window.removeEventListener("eskool-logs-updated", onUpdate);
      window.removeEventListener("focus", onUpdate);
    };
  }, []);

  const sorted = useMemo(() => [...logs].sort((a, b) => String(b.at).localeCompare(String(a.at))), [logs]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Activity logs</h1>
          <p className="max-w-2xl text-base font-medium text-slate-500">
            Audit-style timeline of admin actions on accounts (demo data — stored locally in your browser session).
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <Card className="overflow-hidden border border-white/80 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/90">
                <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                  User name
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                  Action
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                  Target
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                  Date &amp; time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                    No activity recorded yet.
                  </td>
                </tr>
              ) : (
                sorted.map((row) => (
                  <tr key={row.id} className="transition hover:bg-[#1d4ed8]/3">
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.userName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${actionBadge(row.action)}`}>
                        {row.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">{row.target}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">{formatWhen(row.at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
