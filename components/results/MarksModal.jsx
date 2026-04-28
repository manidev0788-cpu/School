"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import {
  RESULT_CLASS_OPTIONS,
  RESULT_EXAM_OPTIONS,
  RESULT_SECTION_OPTIONS,
  SUBJECT_KEYS,
  SUBJECT_LABELS,
  TOTAL_MARKS_MAX,
  gradeLetter,
  percentageFromRow,
  sumMarks,
} from "@/lib/results-data";

function PreviewTotals({ math, english, science }) {
  const row = {
    math: Number(math) || 0,
    english: Number(english) || 0,
    science: Number(science) || 0,
    studentName: "",
    rollNo: "",
    classNum: "",
    section: "",
    exam: "",
    id: "",
  };
  const total = sumMarks(row);
  const pct = percentageFromRow(row);
  const letter = gradeLetter(pct);
  return (
    <div className="rounded-xl border border-[#1d4ed8]/15 bg-[#eff6ff]/80 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1d4ed8]/90">Preview</p>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span>
          <span className="font-semibold text-slate-600">Total:</span>{" "}
          <span className="font-bold tabular-nums text-slate-900">{total}</span>
          <span className="text-slate-500">/{TOTAL_MARKS_MAX}</span>
        </span>
        <span>
          <span className="font-semibold text-slate-600">%:</span>{" "}
          <span className="font-bold tabular-nums text-slate-900">{pct}</span>
        </span>
        <span>
          <span className="font-semibold text-slate-600">Grade:</span>{" "}
          <span className="font-bold text-[#1d4ed8]">{letter}</span>
        </span>
      </div>
    </div>
  );
}

export default function MarksModal({ open, onClose, mode, row, onSave, addDefaults }) {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [math, setMath] = useState("");
  const [english, setEnglish] = useState("");
  const [science, setScience] = useState("");
  const [classNum, setClassNum] = useState(addDefaults?.classNum ?? "9");
  const [section, setSection] = useState(addDefaults?.section ?? "A");
  const [exam, setExam] = useState(addDefaults?.exam ?? "midterm");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && row) {
      setName(row.studentName);
      setRollNo(row.rollNo);
      setMath(String(row.math));
      setEnglish(String(row.english));
      setScience(String(row.science));
      setClassNum(row.classNum);
      setSection(row.section);
      setExam(row.exam);
    } else if (mode === "add") {
      setName("");
      setRollNo("");
      setMath("");
      setEnglish("");
      setScience("");
      setClassNum(addDefaults?.classNum ?? "9");
      setSection(addDefaults?.section ?? "A");
      setExam(addDefaults?.exam ?? "midterm");
    }
  }, [open, mode, row, addDefaults]);

  function clampMarks(v) {
    const n = Number.parseInt(String(v).replace(/\D/g, ""), 10);
    if (Number.isNaN(n)) return 0;
    return Math.min(100, Math.max(0, n));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      studentName: name.trim(),
      rollNo: rollNo.trim(),
      math: clampMarks(math),
      english: clampMarks(english),
      science: clampMarks(science),
      classNum,
      section,
      exam,
    };
    if (!payload.studentName || !payload.rollNo) return;
    onSave(mode, mode === "edit" && row ? row.id : null, payload);
    onClose();
  }

  const examLabel = RESULT_EXAM_OPTIONS.find((o) => o.value === exam)?.label ?? exam;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit marks" : "Add marks"}
      description={
        mode === "edit" ? `${row?.studentName ?? ""} · ${examLabel}` : "Subject-wise scores — totals and grade update automatically."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === "edit" ? (
          <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50/90 px-4 py-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student</p>
              <p className="font-bold text-slate-900">{name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Roll number</p>
              <p className="font-mono font-bold tabular-nums text-slate-900">{rollNo}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="marks-name" className="block text-sm font-semibold text-slate-700">
                  Student name
                </label>
                <input
                  id="marks-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
                />
              </div>
              <div>
                <label htmlFor="marks-roll" className="block text-sm font-semibold text-slate-700">
                  Roll number
                </label>
                <input
                  id="marks-roll"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-base font-semibold tabular-nums outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="marks-class" className="block text-xs font-semibold text-slate-600">
                  Class
                </label>
                <select
                  id="marks-class"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"
                >
                  {RESULT_CLASS_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="marks-section" className="block text-xs font-semibold text-slate-600">
                  Section
                </label>
                <select
                  id="marks-section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"
                >
                  {RESULT_SECTION_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="marks-exam" className="block text-xs font-semibold text-slate-600">
                  Exam
                </label>
                <select
                  id="marks-exam"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"
                >
                  {RESULT_EXAM_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {SUBJECT_KEYS.map((key) => (
            <div key={key}>
              <label htmlFor={`marks-${key}`} className="block text-sm font-semibold text-slate-700">
                {SUBJECT_LABELS[key]} <span className="font-normal text-slate-400">(/100)</span>
              </label>
              <input
                id={`marks-${key}`}
                type="number"
                min={0}
                max={100}
                required
                value={key === "math" ? math : key === "english" ? english : science}
                onChange={(e) => {
                  const v = e.target.value;
                  if (key === "math") setMath(v);
                  else if (key === "english") setEnglish(v);
                  else setScience(v);
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-bold tabular-nums outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
              />
            </div>
          ))}
        </div>

        <PreviewTotals math={math} english={english} science={science} />

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {mode === "edit" ? "Save marks" : "Add entry"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
