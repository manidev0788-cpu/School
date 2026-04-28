"use client";

import { useMemo, useState } from "react";
import ClassModal from "@/components/classes/ClassModal";
import ClassTable from "@/components/classes/ClassTable";
import { CLASS_GRADE_OPTIONS, INITIAL_CLASSES, classDisplayName } from "@/lib/classes-data";

export default function ClassesPageClient() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return classes.filter((c) => {
      if (gradeFilter !== "all" && c.grade !== gradeFilter) return false;
      if (!q) return true;
      const label = classDisplayName(c);
      const hay = `${label} ${c.section} ${c.grade} ${c.classTeacher || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [classes, query, gradeFilter]);

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundSize: "1.25rem",
    backgroundPosition: "right 1rem center",
    backgroundRepeat: "no-repeat",
    appearance: "none",
  };

  const selectClass =
    "mt-1.5 w-full min-w-[200px] cursor-pointer rounded-full border border-slate-200/90 bg-white py-3 pl-5 pr-10 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12";

  function openAdd() {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    setModalMode("edit");
    setEditing(row);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSave(mode, id, payload) {
    if (mode === "edit" && id) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                grade: payload.grade,
                section: payload.section,
                classTeacher: payload.classTeacher,
              }
            : c,
        ),
      );
      return;
    }
    setClasses((prev) => [
      ...prev,
      {
        id: `cl-${Date.now()}`,
        grade: payload.grade,
        section: payload.section,
        totalStudents: payload.totalStudents,
        classTeacher: payload.classTeacher,
      },
    ]);
  }

  function handleDelete(row) {
    const ok = typeof window !== "undefined" && window.confirm(`Remove class ${classDisplayName(row)}?`);
    if (!ok) return;
    setClasses((prev) => prev.filter((c) => c.id !== row.id));
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Classes</h1>
            <p className="max-w-2xl text-base font-medium text-slate-500">
              Organize cohorts by grade and section — assign homeroom teachers and track roster size (demo counts).
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
            Add class
          </button>
        </div>

        <div className="relative max-w-xl">
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </span>
          <label htmlFor="classes-search" className="sr-only">
            Search classes
          </label>
          <input
            id="classes-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by class code (e.g. 10A), grade, section, or teacher…"
            className="w-full rounded-full border border-slate-200/90 bg-white py-3.5 pl-14 pr-5 text-base font-medium text-slate-800 shadow-inner shadow-slate-100/80 outline-none placeholder:text-slate-400 focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <label htmlFor="classes-grade-filter" className="block text-sm font-semibold text-slate-700">
              Filter by grade
            </label>
            <select
              id="classes-grade-filter"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className={selectClass}
              style={selectStyle}
            >
              {CLASS_GRADE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Class directory</h2>
          <ClassTable rows={filtered} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      </div>

      <ClassModal open={modalOpen} onClose={closeModal} mode={modalMode} classRow={modalMode === "edit" ? editing : null} onSave={handleSave} />
    </>
  );
}
