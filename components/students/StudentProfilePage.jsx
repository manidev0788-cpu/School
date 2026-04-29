"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import StudentAvatar from "@/components/students/StudentAvatar";
import { formatInr } from "@/lib/fees-data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { rowToStudent } from "@/lib/students-supabase";

function fmtDisplayDate(iso) {
  if (!iso || typeof iso !== "string") return "—";
  try {
    const d = parseISO(iso.length >= 10 ? iso.slice(0, 10) : iso);
    if (Number.isNaN(d.getTime())) return "—";
    return format(d, "MMM d, yyyy");
  } catch {
    return "—";
  }
}

function dash(val) {
  if (val === null || val === undefined) return "—";
  const s = String(val).trim();
  return s === "" ? "—" : s;
}

/** Label gray-500 small · value bold */
function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}

/** Outer subsection inside gray card */
function SectionCard({ title, children }) {
  return (
    <section className="mt-4 rounded-xl bg-gray-50 p-4">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function StudentProfilePage() {
  const params = useParams();
  const rawId = params?.id;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase || rawId == null) {
      setError("Could not load student.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const idStr = String(Array.isArray(rawId) ? rawId[0] : rawId ?? "").trim();
    if (!idStr) {
      setError("Invalid student link.");
      setLoading(false);
      return;
    }

    const idArg = /^\d+$/.test(idStr) ? Number.parseInt(idStr, 10) : idStr;

    try {
      const { data, error: fetchError } = await supabase.from("students").select("*").eq("id", idArg).maybeSingle();

      if (fetchError) {
        setError(fetchError.message || "Could not load student.");
        setStudent(null);
        return;
      }
      if (!data) {
        setError("Student not found.");
        setStudent(null);
        return;
      }

      setStudent(rowToStudent(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load student.");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, [rawId]);

  useEffect(() => {
    load();
  }, [load]);

  const tuitionDisplay =
    student && typeof student.tuition === "number" && Number.isFinite(student.tuition) && student.tuition >= 0
      ? formatInr(student.tuition)
      : "—";

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      {/* Back — top left */}
      <div>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-[#1d4ed8] transition hover:bg-[#1d4ed8]/10"
        >
          ← Back to Students
        </Link>
      </div>

      {loading ? (
        <div className="mx-auto w-full max-w-[900px] rounded-2xl border border-slate-100 bg-gray-50 p-12 text-center text-base font-medium text-gray-500 shadow-lg">
          Loading profile…
        </div>
      ) : error ? (
        <div className="mx-auto w-full max-w-[900px] rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center font-medium text-rose-900 shadow-lg">
          {error}
        </div>
      ) : student ? (
        <article className="mx-auto w-full max-w-[900px] rounded-2xl border border-slate-100/90 bg-white p-6 shadow-lg">
          {/* Hero */}
          <div className="flex flex-col items-center gap-6 border-b border-slate-100 pb-8 text-center sm:flex-row sm:items-start sm:text-left">
            <StudentAvatar
              name={student.name}
              imageUrl={student.profileImage}
              size="xl"
              className="shrink-0 shadow-lg ring-4 ring-[#eff6ff]"
            />
            <div className="min-w-0 flex-1 space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{dash(student.name)}</h1>
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {student.studentId?.trim() ? (
                  <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-4 py-1.5 font-mono text-sm font-bold tracking-wide text-[#1d4ed8] shadow-sm ring-1 ring-[#1d4ed8]/20">
                    {student.studentId}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-gray-400">No student ID</span>
                )}
              </div>
              <p className="text-lg font-semibold text-slate-600">
                Class <span className="font-bold text-slate-900">{dash(student.classGrade)}</span>
                <span className="mx-2 font-normal text-slate-300">·</span>
                Section <span className="font-bold text-slate-900">{dash(student.section)}</span>
              </p>
            </div>
          </div>

          {/* Academic */}
          <SectionCard title="Academic">
            <Field label="Roll number" value={dash(student.rollNo)} />
            <Field label="Class" value={dash(student.classGrade)} />
            <Field label="Section" value={dash(student.section)} />
            <Field label="Tuition" value={tuitionDisplay} />
            <Field label="Admission date" value={fmtDisplayDate(student.admissionDate)} />
            <Field label="Previous school" value={dash(student.previousSchool)} />
          </SectionCard>

          {/* Personal */}
          <SectionCard title="Personal">
            <Field label="Date of birth" value={fmtDisplayDate(student.dateOfBirth)} />
            <Field label="Gender" value={dash(student.gender)} />
            <Field label="State" value={dash(student.state)} />
            <Field label="ZIP / Postal code" value={dash(student.zipCode)} />
          </SectionCard>

          {/* Parents */}
          <section className="mt-4 rounded-xl bg-gray-50 p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">Parents</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-100/80 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[#1d4ed8]">Father</p>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <Field label="Name" value={dash(student.father_name)} />
                  <Field label="Phone" value={dash(student.father_phone)} />
                  <Field label="Occupation" value={dash(student.father_occupation)} />
                  <Field label="Qualification" value={dash(student.father_qualification)} />
                </div>
              </div>
              <div className="rounded-lg border border-slate-100/80 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-[#1d4ed8]">Mother</p>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <Field label="Name" value={dash(student.mother_name)} />
                  <Field label="Phone" value={dash(student.mother_phone)} />
                  <Field label="Occupation" value={dash(student.mother_occupation)} />
                  <Field label="Qualification" value={dash(student.mother_qualification)} />
                </div>
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="mt-4 rounded-xl bg-gray-50 p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Address" value={dash(student.address)} />
              </div>
              <Field label="City" value={dash(student.city)} />
              <Field label="Famous landmark" value={dash(student.famousLandmark)} />
            </div>
          </section>
        </article>
      ) : null}
    </div>
  );
}
