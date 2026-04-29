"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import StudentForm from "@/components/students/StudentForm";
import StudentTable from "@/components/students/StudentTable";
import { emptyStudentForm, tuitionForClassGrade, splitIsoDateToDobParts, formatStudentDobForDb } from "@/lib/students-data";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";
import { allocateNextStudentId, backfillMissingStudentRegistryIds } from "@/lib/student-id";
import { uploadStudentProfileImage } from "@/lib/student-profile-image";
import { rowToStudent, buildStudentPayload } from "@/lib/students-supabase";
import { upsertAutoAssignmentFee } from "@/lib/student-fees";

/** Richer message when Postgres blocks writes due to missing/broken RLS policies or stale schema cache. */
function dbErrorHint(message) {
  if (typeof message !== "string") return message ?? "";
  if (/row-level security/i.test(message)) {
    return `${message} Fix: Supabase → SQL → run supabase/repair_rls_public_tables.sql → then run NOTIFY pgrst, 'reload schema'; (or wait ~1 min).`;
  }
  if (/profile_image|schema cache|PGRST204/i.test(message)) {
    return `${message} Fix: Supabase → SQL → alter table public.students add column if not exists profile_image text; → NOTIFY pgrst, 'reload schema'; (repair_rls_public_tables.sql includes this.)`;
  }
  return message;
}

function studentToForm(s) {
  const merged = { ...emptyStudentForm(), ...s };
  if (typeof merged.tuition === "number") merged.tuition = String(merged.tuition);
  else if (merged.tuition == null || merged.tuition === undefined) merged.tuition = "";
  const adm = splitIsoDateToDobParts(merged.admissionDate || "");
  merged.admission_day = adm.dob_day;
  merged.admission_month = adm.dob_month;
  merged.admission_year = adm.dob_year;
  return merged;
}

export default function StudentsPageClient() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [students, setStudents] = useState([]);
  const [feeCatalog, setFeeCatalog] = useState(() => new Map());
  const [assignmentFees, setAssignmentFees] = useState({});
  const [loading, setLoading] = useState(configured);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyStudentForm());
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [submitError, setSubmitError] = useState(null);
  const [successModal, setSuccessModal] = useState({ open: false, title: "", detail: "" });
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);

  const loadFeeCatalog = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setFeeCatalog(new Map());
      return;
    }
    const { data, error } = await client.from("class_fees").select("class_name, fee_amount");
    if (error) {
      console.error("[StudentsPageClient] class_fees load failed:", error.message || error);
      setFeeCatalog(new Map());
      return;
    }
    const m = new Map();
    (data || []).forEach((r) => {
      m.set(r.class_name, Number(r.fee_amount));
    });
    setFeeCatalog(m);
  }, []);

  const refreshAssignmentFees = useCallback(async (list) => {
    const client = getSupabaseBrowserClient();
    if (!client || !list.length) {
      setAssignmentFees({});
      return;
    }
    const ids = list.map((s) => s.id);
    const { data } = await client
      .from("fees")
      .select("student_id, amount, status")
      .eq("fee_source", "class_assignment")
      .in("student_id", ids);
    const o = {};
    (data || []).forEach((r) => {
      o[r.student_id] = { amount: Number(r.amount), status: r.status };
    });
    setAssignmentFees(o);
  }, []);

  const loadStudents = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      setStudents([]);
      if (!isSupabaseConfigured()) {
        setError(
          "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and a valid NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (replace placeholder text), then restart the dev server.",
        );
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message || "Could not load students.");
        setStudents([]);
        return;
      }

      const mapped = (data || []).map(rowToStudent).filter(Boolean);
      let list = mapped;
      if (mapped.some((s) => !String(s.studentId ?? "").trim())) {
        list = await backfillMissingStudentRegistryIds(supabase, mapped, rowToStudent);
      }
      setStudents(list);
      await refreshAssignmentFees(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [refreshAssignmentFees]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadFeeCatalog();
  }, [loadFeeCatalog]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const t = setTimeout(() => setSuccessMessage(null), 5500);
    return () => clearTimeout(t);
  }, [successMessage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const hay =
        `${s.studentId ?? ""} ${s.name} ${s.classGrade} ${s.section} ${s.rollNo} ${s.father_name ?? ""} ${s.mother_name ?? ""} ${s.famousLandmark ?? ""} ${s.city ?? ""} ${s.state ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [students, query]);

  const classFeePreview = useMemo(() => {
    const key = form.classGrade?.trim();
    if (!key) {
      return { catalogAmount: null, warning: null, assigned: null };
    }
    const ladder = tuitionForClassGrade(key);
    if (typeof ladder === "number") {
      return {
        catalogAmount: ladder,
        warning: null,
        assigned: editingId ? assignmentFees[editingId] : null,
      };
    }
    if (!feeCatalog.has(key)) {
      return {
        catalogAmount: null,
        warning: `No tuition configured for grade "${key}". Run supabase/ensure_class_fees_schema.sql in Supabase.`,
        assigned: editingId ? assignmentFees[editingId] : null,
      };
    }
    return {
      catalogAmount: feeCatalog.get(key),
      warning: null,
      assigned: editingId ? assignmentFees[editingId] : null,
    };
  }, [form.classGrade, feeCatalog, editingId, assignmentFees]);

  const reportAvatarFilePending = useCallback((file) => {
    setPendingAvatarFile(file ?? null);
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm(emptyStudentForm());
    setSubmitError(null);
    setPendingAvatarFile(null);
    setModalOpen(true);
  }

  function openEdit(student) {
    setEditingId(student.id);
    setForm(studentToForm(student));
    setSubmitError(null);
    setPendingAvatarFile(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyStudentForm());
    setSubmitError(null);
    setPendingAvatarFile(null);
  }

  function closeSuccessModal() {
    setSuccessModal({ open: false, title: "", detail: "" });
  }

  async function handleSubmit() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setSubmitError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server.",
      );
      return;
    }

    const ladderAmt = tuitionForClassGrade(form.classGrade?.trim());
    const catalogAmt =
      typeof ladderAmt === "number"
        ? ladderAmt
        : typeof feeCatalog.get(form.classGrade?.trim()) === "number"
          ? feeCatalog.get(form.classGrade?.trim())
          : null;
    let payload = buildStudentPayload(form, typeof catalogAmt === "number" ? catalogAmt : null);

    setSubmitting(true);
    setSubmitError(null);
    setError(null);

    try {
      if (pendingAvatarFile) {
        payload = {
          ...payload,
          profile_image: await uploadStudentProfileImage(supabase, pendingAvatarFile, {
            studentId: editingId ?? undefined,
          }),
        };
      }

      console.log("[students save] payload", payload);

      if (editingId) {
        const { data, error: updateError } = await supabase
          .from("students")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single();

        console.log("[students save] update response", data, updateError);

        if (updateError) {
          setSubmitError(dbErrorHint(updateError.message || "Could not update student."));
          return;
        }

        const updated = rowToStudent(data);
        if (!updated) {
          setSubmitError("Could not read saved student.");
          return;
        }

        const nextList = students.map((s) => (s.id === editingId ? updated : s));
        setStudents(nextList);

        const feeResult = await upsertAutoAssignmentFee(supabase, {
          studentId: updated.id,
          studentName: updated.name,
          classGrade: updated.classGrade,
          section: updated.section,
        });

        await refreshAssignmentFees(nextList);

        let detail = "";
        if (!feeResult.ok && feeResult.warning) detail = feeResult.warning;
        else if (!feeResult.ok && feeResult.error) detail = `Tuition could not be synced: ${feeResult.error}`;
        else detail = "Tuition assignment updated.";

        closeModal();
        setSuccessModal({
          open: true,
          title: "Student updated successfully 🎉",
          detail,
        });
        return;
      }

      let insertRow = null;
      let insertError = null;
      const dobIsoForRegistryId = formatStudentDobForDb(form);
      for (let attempt = 0; attempt < 15; attempt += 1) {
        const student_id = await allocateNextStudentId(supabase, form.name, dobIsoForRegistryId || null);
        const { data, error } = await supabase.from("students").insert([{ ...payload, student_id }]).select().single();
        console.log("[students save] insert response", data, error);
        if (!error && data) {
          insertRow = data;
          insertError = null;
          break;
        }
        insertError = error;
        const msg = error?.message ?? "";
        const code = error?.code ?? "";
        if (code === "23505" || /duplicate key|unique constraint/i.test(msg)) continue;
        break;
      }

      if (insertError || !insertRow) {
        setSubmitError(dbErrorHint(insertError?.message || "Could not add student."));
        return;
      }

      const created = rowToStudent(insertRow);
      if (!created) {
        setSubmitError("Could not read new student.");
        return;
      }

      const nextList = [created, ...students.filter((s) => s.id !== created.id)];
      setStudents(nextList);

      const feeResult = await upsertAutoAssignmentFee(supabase, {
        studentId: created.id,
        studentName: created.name,
        classGrade: created.classGrade,
        section: created.section,
      });

      await refreshAssignmentFees(nextList);

      let detail = "";
      if (!feeResult.ok && feeResult.warning) detail = feeResult.warning;
      else if (!feeResult.ok && feeResult.error) detail = `Tuition could not be synced: ${feeResult.error}`;
      else detail = "Pending tuition fee created.";

      closeModal();
      setSuccessModal({
        open: true,
        title: "Student added successfully 🎉",
        detail,
      });
    } catch (e) {
      console.error("[students save]", e);
      const msg =
        e instanceof Error
          ? e.message
          : e &&
              typeof e === "object" &&
              e !== null &&
              "message" in e &&
              typeof e.message === "string"
            ? e.message
            : typeof e === "string"
              ? e
              : "Something went wrong while saving.";
      setSubmitError(dbErrorHint(msg));
    } finally {
      setSubmitting(false);
    }
  }

  function handleAdmissionPartsChange(patch) {
    setSubmitError(null);
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    if (name === "studentId") return;
    setSubmitError(null);
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "classGrade") {
        const auto = tuitionForClassGrade(value);
        if (typeof auto === "number") next.tuition = String(auto);
      }
      return next;
    });
  }

  async function handleDelete(student) {
    const ok = typeof window !== "undefined" && window.confirm(`Remove ${student.name} from the list?`);
    if (!ok) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured. Add credentials to .env.local and restart the dev server.");
      return;
    }

    setError(null);

    const { error: deleteError } = await supabase.from("students").delete().eq("id", student.id);

    if (deleteError) {
      setError(deleteError.message || "Could not delete student.");
      return;
    }

    const nextList = students.filter((s) => s.id !== student.id);
    setStudents(nextList);
    await refreshAssignmentFees(nextList);
    setSuccessMessage(`${student.name} removed.`);
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Student management</h1>
            <p className="max-w-2xl text-base font-medium text-slate-500">
              View and maintain learner records. Name, class, section, roll number, and tuition are saved to Supabase; optional steps are not stored unless your database adds matching columns.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            disabled={!configured || loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 enabled:cursor-pointer sm:self-center disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add student
          </button>
        </div>

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
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    loadStudents();
                  }}
                  className="rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-rose-900 underline-offset-2 hover:underline"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-rose-800 underline-offset-2 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative max-w-xl">
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </span>
          <label htmlFor="students-search" className="sr-only">
            Filter students
          </label>
          <input
            id="students-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student ID, name, class, section, roll no., father or mother…"
            disabled={loading}
            className="w-full rounded-full border border-slate-200/90 bg-white py-3.5 pl-14 pr-5 text-base font-medium text-slate-800 shadow-inner shadow-slate-100/80 outline-none ring-[#1d4ed8]/0 transition placeholder:text-slate-400 focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12 disabled:opacity-60"
          />
        </div>

        <StudentTable
          students={filtered}
          totalCount={students.length}
          loading={loading}
          configured={configured}
          assignmentFees={assignmentFees}
          onViewProfile={(s) => router.push(`/students/${s.id}`)}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit student" : "Add student"}
        description={
          editingId ? "Update details across the steps and save." : "Use the steps below to register a new student."
        }
        size="lg"
        panelClassName="flex max-h-[min(92vh,56rem)] w-full max-w-[min(96vw,52rem)] flex-col overflow-hidden sm:max-w-[52rem]"
        bodyClassName="min-h-0 flex-1 flex flex-col overflow-hidden"
      >
        <StudentForm
          values={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
          submitLabel={editingId ? "Save changes" : "Add student"}
          idPrefix={editingId ? "edit" : "add"}
          isEditing={Boolean(editingId)}
          modalOpen={modalOpen}
          classFeePreview={classFeePreview}
          submitError={submitError}
          onAvatarFilePendingChange={reportAvatarFilePending}
          onAdmissionPartsChange={handleAdmissionPartsChange}
        />
      </Modal>

      <Modal open={successModal.open} onClose={closeSuccessModal} title={successModal.title} panelClassName="max-w-md">
        {successModal.detail ? (
          <p className="text-sm font-medium leading-relaxed text-slate-600">{successModal.detail}</p>
        ) : null}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={closeSuccessModal}
            className="rounded-xl bg-[#1d4ed8] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af]"
          >
            OK
          </button>
        </div>
      </Modal>
    </>
  );
}
