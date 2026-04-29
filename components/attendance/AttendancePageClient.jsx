"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { classDisplayName } from "@/lib/classes-data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  classRowFromDb,
  mergeAttendanceMarks,
  rosterStudentFromDb,
} from "@/lib/attendance-supabase";

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

export default function AttendancePageClient() {
  const configured = isSupabaseConfigured();

  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(configured);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [dateStr, setDateStr] = useState(todayIsoLocal);
  const [roster, setRoster] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId) ?? null,
    [classes, selectedClassId],
  );

  const loadClasses = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setClassesLoading(false);
      setClasses([]);
      return;
    }

    setClassesLoading(true);
    setError(null);

    const { data, error: fetchError } = await client.from("classes").select("*").order("grade").order("section");

    setClassesLoading(false);

    if (fetchError) {
      setError(fetchError.message || "Could not load classes.");
      setClasses([]);
      return;
    }

    const mapped = (data || []).map(classRowFromDb).filter(Boolean);
    setClasses(mapped);
    setSelectedClassId((prev) => prev || mapped[0]?.id || "");
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const loadRosterAndMarks = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client || !configured || !selectedClassId || !selectedClass) {
      setRoster([]);
      setMarks({});
      setStudentsLoading(false);
      return;
    }

    setStudentsLoading(true);
    setError(null);

    const { data: studRows, error: studErr } = await client
      .from("students")
      .select("*")
      .eq("class", selectedClass.grade)
      .eq("section", selectedClass.section);

    if (studErr) {
      setError(studErr.message || "Could not load students.");
      setRoster([]);
      setMarks({});
      setStudentsLoading(false);
      return;
    }

    const list = (studRows || [])
      .map(rosterStudentFromDb)
      .filter(Boolean)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    setRoster(list);

    const ids = list.map((s) => s.id);
    if (ids.length === 0) {
      setMarks({});
      setStudentsLoading(false);
      return;
    }

    const { data: attRows, error: attErr } = await client
      .from("attendance")
      .select("student_id, status")
      .eq("class_id", selectedClassId)
      .eq("date", dateStr)
      .in("student_id", ids);

    if (attErr) {
      setError(attErr.message || "Could not load saved attendance.");
      setMarks(mergeAttendanceMarks(ids, []));
      setStudentsLoading(false);
      return;
    }

    setMarks(mergeAttendanceMarks(ids, attRows));
    setStudentsLoading(false);
  }, [configured, dateStr, selectedClass, selectedClassId]);

  useEffect(() => {
    loadRosterAndMarks();
  }, [loadRosterAndMarks]);

  const counts = useMemo(() => {
    let present = 0;
    let absent = 0;
    roster.forEach((s) => {
      const st = marks[s.id] ?? "present";
      if (st === "present") present += 1;
      else absent += 1;
    });
    return {
      total: roster.length,
      present,
      absent,
    };
  }, [marks, roster]);

  function setStatus(studentId, status) {
    if (status !== "present" && status !== "absent") return;
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  }

  function markAllPresent() {
    setMarks((prev) => {
      const next = { ...prev };
      roster.forEach((s) => {
        next[s.id] = "present";
      });
      return next;
    });
  }

  async function handleSave() {
    const client = getSupabaseBrowserClient();
    if (!client || !selectedClassId || roster.length === 0) {
      if (!configured) {
        setError("Supabase is not configured. Add credentials to .env.local and restart the dev server.");
      }
      return;
    }

    setSaving(true);
    setError(null);

    const rows = roster.map((s) => ({
      student_id: s.id,
      class_id: selectedClassId,
      date: dateStr,
      status: marks[s.id] ?? "present",
    }));

    const { error: saveError } = await client.from("attendance").upsert(rows, {
      onConflict: "student_id,class_id,date",
    });

    setSaving(false);

    if (saveError) {
      setError(saveError.message || "Could not save attendance.");
      return;
    }

    setSuccessMessage("Attendance saved successfully.");
  }

  const selectClass =
    "min-w-[220px] cursor-pointer rounded-full border border-slate-200/90 bg-white py-3.5 pl-5 pr-10 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12 disabled:cursor-not-allowed disabled:opacity-60";
  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundSize: "1.25rem",
    backgroundPosition: "right 1rem center",
    backgroundRepeat: "no-repeat",
    appearance: "none",
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Attendance</h1>
        <p className="max-w-2xl text-base font-medium text-slate-500">
          Mark daily attendance by class. Records are stored in Supabase for the selected date.
        </p>
      </div>

      {!configured && (
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950"
          role="status"
        >
          Supabase env vars are missing. Add{" "}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          to <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">.env.local</code>, run SQL for{" "}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">classes</code> and{" "}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">attendance</code>, then restart{" "}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">npm run dev</code>.
        </div>
      )}

      {successMessage && (
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950"
          role="status"
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950" role="alert">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-rose-800 underline-offset-2 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
                disabled={!configured || classesLoading}
                className="mt-1 w-full cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#1d4ed8]/40 focus:ring-2 focus:ring-[#1d4ed8]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="attendance-class" className="block text-sm font-semibold text-slate-700">
              Class
            </label>
            <select
              id="attendance-class"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={!configured || classesLoading || classes.length === 0}
              className={selectClass}
              style={selectStyle}
            >
              {classesLoading ? (
                <option value="">Loading classes…</option>
              ) : classes.length === 0 ? (
                <option value="">No classes — run SQL seed</option>
              ) : (
                classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {classDisplayName({ grade: c.grade, section: c.section })}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 pb-0.5 sm:items-center">
            <button
              type="button"
              onClick={markAllPresent}
              disabled={!configured || studentsLoading || roster.length === 0 || saving}
              className="rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark all present
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!configured || !selectedClassId || roster.length === 0 || saving || studentsLoading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 enabled:cursor-pointer xl:self-end disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
              Saving…
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Save attendance
            </>
          )}
        </button>
      </div>

      <AttendanceSummary total={counts.total} present={counts.present} absent={counts.absent} />

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Student roster</h2>
        {studentsLoading ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-base font-medium text-slate-500">
            Loading students…
          </p>
        ) : roster.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-base font-medium text-slate-500">
            {!configured
              ? "Configure Supabase to load classes and students."
              : !selectedClassId || classes.length === 0
                ? "Add classes in Supabase (run classes.sql), then pick a class."
                : "No students match this class (grade + section). Add students with the same grade and section."}
          </p>
        ) : (
          <AttendanceTable students={roster} marks={marks} onChange={setStatus} />
        )}
      </div>
    </div>
  );
}
