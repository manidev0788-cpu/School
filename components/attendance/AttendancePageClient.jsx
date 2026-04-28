"use client";

import { useEffect, useMemo, useState } from "react";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { ATTENDANCE_CLASSES, STUDENTS_BY_CLASS } from "@/lib/attendance-data";

function formatDisplayDate(isoDateStr) {
  try {
    const [y, m, d] = isoDateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDateStr;
  }
}

function todayIsoLocal() {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}

function emptyMarksForStudents(studentIds) {
  const o = {};
  studentIds.forEach((id) => {
    o[id] = "present";
  });
  return o;
}

export default function AttendancePageClient() {
  const [classId, setClassId] = useState(ATTENDANCE_CLASSES[0]?.id ?? "");
  const [dateStr, setDateStr] = useState(todayIsoLocal);
  const [marks, setMarks] = useState({});
  const [saveToast, setSaveToast] = useState(false);

  const roster = STUDENTS_BY_CLASS[classId] ?? [];

  useEffect(() => {
    setMarks(emptyMarksForStudents(roster.map((s) => s.id)));
  }, [classId]);

  const counts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    roster.forEach((s) => {
      const st = marks[s.id] ?? "present";
      if (st === "present") present += 1;
      else if (st === "absent") absent += 1;
      else if (st === "late") late += 1;
    });
    return {
      total: roster.length,
      present,
      absent,
      late,
    };
  }, [marks, roster]);

  function setStatus(studentId, status) {
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSave() {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2800);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Attendance</h1>
        <p className="max-w-2xl text-base font-medium text-slate-500">
          Mark daily attendance by class. Changes stay on this device until you connect a backend.
        </p>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:flex-wrap xl:items-end xl:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="space-y-2">
            <label htmlFor="attendance-date" className="block text-sm font-semibold text-slate-700">
              Date
            </label>
            <div className="flex flex-col gap-1 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-inner shadow-slate-100/80 sm:min-w-[280px]">
              <span className="text-base font-semibold text-slate-900">{formatDisplayDate(dateStr)}</span>
              <input
                id="attendance-date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="mt-1 w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#1d4ed8]/40 focus:ring-2 focus:ring-[#1d4ed8]/15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="attendance-class" className="block text-sm font-semibold text-slate-700">
              Class
            </label>
            <select
              id="attendance-class"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="min-w-[220px] cursor-pointer rounded-full border border-slate-200/90 bg-white py-3.5 pl-5 pr-10 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundSize: "1.25rem",
                backgroundPosition: "right 1rem center",
                backgroundRepeat: "no-repeat",
                appearance: "none",
              }}
            >
              {ATTENDANCE_CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 xl:self-end"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Save attendance
        </button>
      </div>

      {saveToast ? (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-100"
        >
          Attendance saved for this session (demo — no server yet).
        </div>
      ) : null}

      <AttendanceSummary total={counts.total} present={counts.present} absent={counts.absent} late={counts.late} />

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Student roster</h2>
        {roster.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-base font-medium text-slate-500">
            No students found for this class.
          </p>
        ) : (
          <AttendanceTable students={roster} marks={marks} onChange={setStatus} />
        )}
      </div>
    </div>
  );
}
