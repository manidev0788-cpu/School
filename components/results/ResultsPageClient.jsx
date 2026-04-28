"use client";

import { useMemo, useState } from "react";
import MarksModal from "@/components/results/MarksModal";
import ResultsTable from "@/components/results/ResultsTable";
import {
  INITIAL_RESULT_ROWS,
  RESULT_CLASS_OPTIONS,
  RESULT_EXAM_OPTIONS,
  RESULT_SECTION_OPTIONS,
} from "@/lib/results-data";

export default function ResultsPageClient() {
  const [rows, setRows] = useState(INITIAL_RESULT_ROWS);
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [editingRow, setEditingRow] = useState(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (classFilter !== "all" && r.classNum !== classFilter) return false;
      if (sectionFilter !== "all" && r.section !== sectionFilter) return false;
      if (examFilter !== "all" && r.exam !== examFilter) return false;
      return true;
    });
  }, [rows, classFilter, sectionFilter, examFilter]);

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
    setEditingRow(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    setModalMode("edit");
    setEditingRow(row);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingRow(null);
  }

  function handleSave(mode, id, payload) {
    if (mode === "edit" && id) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                math: payload.math,
                english: payload.english,
                science: payload.science,
              }
            : r,
        ),
      );
      return;
    }
    setRows((prev) => [
      ...prev,
      {
        id: `res-${Date.now()}`,
        studentName: payload.studentName,
        rollNo: payload.rollNo,
        classNum: payload.classNum,
        section: payload.section,
        exam: payload.exam,
        math: payload.math,
        english: payload.english,
        science: payload.science,
      },
    ]);
  }

  const addDefaults =
    classFilter !== "all" && sectionFilter !== "all" && examFilter !== "all"
      ? { classNum: classFilter, section: sectionFilter, exam: examFilter }
      : { classNum: "9", section: "A", exam: "midterm" };

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Exam & Results</h1>
            <p className="max-w-2xl text-base font-medium text-slate-500">
              Review subject scores, totals, and grades — filters help you focus on one cohort at a time (demo data).
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
            Add marks
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap">
            <div className="space-y-2">
              <label htmlFor="res-class" className="block text-sm font-semibold text-slate-700">
                Class
              </label>
              <select
                id="res-class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {RESULT_CLASS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="res-section" className="block text-sm font-semibold text-slate-700">
                Section
              </label>
              <select
                id="res-section"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {RESULT_SECTION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="res-exam" className="block text-sm font-semibold text-slate-700">
                Exam
              </label>
              <select
                id="res-exam"
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {RESULT_EXAM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Student results</h2>
          <ResultsTable rows={filtered} onEdit={openEdit} />
        </div>
      </div>

      <MarksModal
        open={modalOpen}
        onClose={closeModal}
        mode={modalMode}
        row={modalMode === "edit" ? editingRow : null}
        addDefaults={addDefaults}
        onSave={handleSave}
      />
    </>
  );
}
