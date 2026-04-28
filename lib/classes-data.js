/** Static dummy data — Class Management UI */

/** Grade levels for forms & filters */
export const CLASS_GRADE_OPTIONS = [
  { value: "all", label: "All grades" },
  ...["6", "7", "8", "9", "10", "11", "12"].map((g) => ({ value: g, label: `Grade ${g}` })),
];

export const FORM_GRADE_OPTIONS = CLASS_GRADE_OPTIONS.filter((o) => o.value !== "all");

export const FORM_SECTION_OPTIONS = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
];

/** Faculty names for optional class teacher assignment */
export const CLASS_TEACHER_OPTIONS = [
  { value: "", label: "None (unassigned)" },
  { value: "Priya Menon", label: "Priya Menon" },
  { value: "Rajesh Iyer", label: "Rajesh Iyer" },
  { value: "Ananya Das", label: "Ananya Das" },
  { value: "Karthik Nair", label: "Karthik Nair" },
  { value: "Sunita Rao", label: "Sunita Rao" },
  { value: "Dev Patel", label: "Dev Patel" },
  { value: "Meera Krishnan", label: "Meera Krishnan" },
];

export function classDisplayName(row) {
  return `${row.grade}${row.section}`;
}

/** Dummy classes — student counts are static for demo */
export const INITIAL_CLASSES = [
  { id: "cl-1", grade: "10", section: "A", totalStudents: 42, classTeacher: "Priya Menon" },
  { id: "cl-2", grade: "10", section: "B", totalStudents: 38, classTeacher: "Rajesh Iyer" },
  { id: "cl-3", grade: "9", section: "A", totalStudents: 45, classTeacher: "Ananya Das" },
  { id: "cl-4", grade: "9", section: "B", totalStudents: 40, classTeacher: "" },
  { id: "cl-5", grade: "8", section: "A", totalStudents: 36, classTeacher: "Meera Krishnan" },
  { id: "cl-6", grade: "8", section: "B", totalStudents: 34, classTeacher: "Sunita Rao" },
  { id: "cl-7", grade: "11", section: "A", totalStudents: 33, classTeacher: "Dev Patel" },
];
