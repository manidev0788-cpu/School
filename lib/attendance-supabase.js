/** Minimal shapes for attendance roster / dropdown — maps DB snake_case rows */

import { studentNameFromRow } from "@/lib/students-supabase";

export function classRowFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    grade: row.grade ?? "",
    section: row.section ?? "",
    classTeacher: row.class_teacher ?? "",
  };
}

export function rosterStudentFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: studentNameFromRow(row),
    rollNo: row.roll_number != null ? String(row.roll_number) : row.roll_no != null ? String(row.roll_no) : "",
  };
}

/** Map attendance rows to marks Record<id, 'present' | 'absent'> — defaults filled by caller */
export function mergeAttendanceMarks(studentIds, rows, defaultStatus = "present") {
  const marks = {};
  studentIds.forEach((id) => {
    marks[id] = defaultStatus;
  });
  (rows || []).forEach((row) => {
    const sid = row.student_id;
    if (sid && (row.status === "present" || row.status === "absent")) {
      marks[sid] = row.status;
    }
  });
  return marks;
}
