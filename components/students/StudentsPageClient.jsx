"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import StudentForm from "@/components/students/StudentForm";
import StudentTable from "@/components/students/StudentTable";
import { INITIAL_STUDENTS, emptyStudentForm } from "@/lib/students-data";

function studentToForm(s) {
  return { ...emptyStudentForm(), ...s };
}

export default function StudentsPageClient() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyStudentForm());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const hay =
        `${s.name} ${s.classGrade} ${s.section} ${s.rollNo} ${s.parentName} ${s.city ?? ""} ${s.state ?? ""} ${s.fatherName ?? ""} ${s.motherName ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [students, query]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyStudentForm());
    setModalOpen(true);
  }

  function openEdit(student) {
    setEditingId(student.id);
    setForm(studentToForm(student));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyStudentForm());
  }

  function handleSubmit() {
    const parentName = [form.fatherName, form.motherName].filter(Boolean).join(" · ");
    const payload = { ...form, parentName };

    if (editingId) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                ...payload,
              }
            : s,
        ),
      );
    } else {
      const id = `stu-${Date.now()}`;
      setStudents((prev) => [...prev, { id, ...payload }]);
    }
    closeModal();
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDelete(student) {
    const ok = typeof window !== "undefined" && window.confirm(`Remove ${student.name} from the list?`);
    if (!ok) return;
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Student management</h1>
            <p className="max-w-2xl text-base font-medium text-slate-500">
              View and maintain learner records — class, section, roll number, and guardian details.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 sm:self-center"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add student
          </button>
        </div>

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
            placeholder="Search by name, class, section, roll no., or parent…"
            className="w-full rounded-full border border-slate-200/90 bg-white py-3.5 pl-14 pr-5 text-base font-medium text-slate-800 shadow-inner shadow-slate-100/80 outline-none ring-[#1d4ed8]/0 transition placeholder:text-slate-400 focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <StudentTable students={filtered} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit student" : "Add student"}
        description={
          editingId ? "Update details across the steps and save." : "Use the steps below to register a new student."
        }
        panelClassName="max-w-2xl"
      >
        <StudentForm
          values={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitLabel={editingId ? "Save changes" : "Add student"}
          idPrefix={editingId ? "edit" : "add"}
          modalOpen={modalOpen}
        />
      </Modal>
    </>
  );
}
