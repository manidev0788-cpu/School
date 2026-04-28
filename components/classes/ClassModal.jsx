"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import {
  CLASS_TEACHER_OPTIONS,
  FORM_GRADE_OPTIONS,
  FORM_SECTION_OPTIONS,
  classDisplayName,
} from "@/lib/classes-data";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/40 focus:bg-white focus:ring-4 focus:ring-[#1d4ed8]/12";

export default function ClassModal({ open, onClose, mode, classRow, onSave }) {
  const [grade, setGrade] = useState("10");
  const [section, setSection] = useState("A");
  const [classTeacher, setClassTeacher] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && classRow) {
      setGrade(classRow.grade);
      setSection(classRow.section);
      setClassTeacher(classRow.classTeacher ?? "");
    } else if (mode === "add") {
      setGrade(FORM_GRADE_OPTIONS.find((o) => o.value === "10")?.value ?? FORM_GRADE_OPTIONS[0]?.value ?? "10");
      setSection("A");
      setClassTeacher("");
    }
  }, [open, mode, classRow]);

  function handleSubmit(e) {
    e.preventDefault();
    const teacherName = classTeacher.trim();
    onSave(mode, mode === "edit" && classRow ? classRow.id : null, {
      grade,
      section,
      classTeacher: teacherName,
      totalStudents: mode === "edit" && classRow ? classRow.totalStudents : 32,
    });
    onClose();
  }

  const preview = classDisplayName({ grade, section });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit class" : "Add class"}
      description={
        mode === "edit"
          ? `Update ${classRow ? classDisplayName(classRow) : ""} · counts stay static in demo mode.`
          : "Combine grade and section — preview updates below."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-[#1d4ed8]/15 bg-[#eff6ff]/80 px-4 py-3 text-sm font-semibold text-[#1d4ed8]">
          Class label: <span className="text-lg font-bold text-slate-900">{preview}</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cm-grade" className="block text-sm font-semibold text-slate-700">
              Grade (class name)
            </label>
            <select id="cm-grade" required value={grade} onChange={(e) => setGrade(e.target.value)} className={`${inputClass} cursor-pointer bg-white`}>
              {FORM_GRADE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cm-section" className="block text-sm font-semibold text-slate-700">
              Section
            </label>
            <select id="cm-section" required value={section} onChange={(e) => setSection(e.target.value)} className={`${inputClass} cursor-pointer bg-white`}>
              {FORM_SECTION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="cm-teacher" className="block text-sm font-semibold text-slate-700">
            Assign class teacher <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <select id="cm-teacher" value={classTeacher} onChange={(e) => setClassTeacher(e.target.value)} className={`${inputClass} cursor-pointer bg-white`}>
            {CLASS_TEACHER_OPTIONS.map((o) => (
              <option key={o.value === "" ? "none" : o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl">
            {mode === "edit" ? "Save changes" : "Add class"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
