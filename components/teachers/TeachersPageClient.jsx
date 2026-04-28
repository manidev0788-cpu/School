"use client";

import { useMemo, useState } from "react";
import TeacherModal from "@/components/teachers/TeacherModal";
import TeacherTable from "@/components/teachers/TeacherTable";
import { INITIAL_TEACHERS, TEACHER_CLASS_OPTIONS, TEACHER_SUBJECT_OPTIONS } from "@/lib/teachers-data";

export default function TeachersPageClient() {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers.filter((t) => {
      if (subjectFilter !== "all" && t.subject !== subjectFilter) return false;
      if (classFilter !== "all" && t.assignedClass !== classFilter) return false;
      if (!q) return true;
      const hay = `${t.name} ${t.subject} ${t.assignedClass} ${t.phone} ${t.email}`.toLowerCase();
      return hay.includes(q);
    });
  }, [teachers, query, subjectFilter, classFilter]);

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundSize: "1.25rem",
    backgroundPosition: "right 1rem center",
    backgroundRepeat: "no-repeat",
    appearance: "none",
  };

  const selectClass =
    "mt-1.5 w-full min-w-[180px] cursor-pointer rounded-full border border-slate-200/90 bg-white py-3 pl-5 pr-10 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12";

  function openAdd() {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(t) {
    setModalMode("edit");
    setEditing(t);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(mode, id, payload) {
    if (mode === "edit" && id) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                ...payload,
              }
            : t,
        ),
      );
      return;
    }
    setTeachers((prev) => [...prev, { id: `t-${Date.now()}`, ...payload }]);
  }

  function handleDelete(t) {
    const ok = typeof window !== "undefined" && window.confirm(`Remove ${t.name} from the directory?`);
    if (!ok) return;
    setTeachers((prev) => prev.filter((x) => x.id !== t.id));
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Teachers</h1>
            <p className="max-w-2xl text-base font-medium text-slate-500">
              Faculty directory — search by name or contact, narrow by subject or class (demo data).
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add teacher
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
          <label htmlFor="teachers-search" className="sr-only">
            Search teachers
          </label>
          <input
            id="teachers-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, subject, class, phone, or email…"
            className="w-full rounded-full border border-slate-200/90 bg-white py-3.5 pl-14 pr-5 text-base font-medium text-slate-800 shadow-inner shadow-slate-100/80 outline-none ring-[#1d4ed8]/0 transition placeholder:text-slate-400 focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap">
            <div className="space-y-2">
              <label htmlFor="filter-subject" className="block text-sm font-semibold text-slate-700">
                Subject
              </label>
              <select
                id="filter-subject"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {TEACHER_SUBJECT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="filter-class" className="block text-sm font-semibold text-slate-700">
                Class
              </label>
              <select
                id="filter-class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {TEACHER_CLASS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Faculty list</h2>
          <TeacherTable rows={filtered} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      </div>

      <TeacherModal
        open={modalOpen}
        onClose={closeModal}
        mode={modalMode}
        teacher={modalMode === "edit" ? editing : null}
        onSave={handleSave}
      />
    </>
  );
}
