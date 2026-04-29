import { classDisplayName } from "@/lib/classes-data";
import { studentNameFromRow } from "@/lib/students-supabase";

/** Flat row for fees UI — maps Supabase joined row */
export function feeRowFromJoin(row) {
  if (!row) return null;
  const st = Array.isArray(row.students) ? row.students[0] : row.students;
  const grade = st?.["class"] ?? st?.class_grade ?? "";
  const section = st?.section ?? "";
  const amt = row.amount;
  const amountNum = typeof amt === "number" ? amt : Number.parseFloat(String(amt ?? 0));
  const joinedClass = classDisplayName({ grade, section });
  const nameFromRow = typeof row.student_name === "string" && row.student_name.trim() ? row.student_name.trim() : null;
  const classFromRow = typeof row.class_label === "string" && row.class_label.trim() ? row.class_label.trim() : null;
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: nameFromRow ?? studentNameFromRow(st) ?? "Unknown",
    classLabel: classFromRow ?? joinedClass,
    amount: Number.isFinite(amountNum) ? amountNum : 0,
    status: row.status === "pending" ? "pending" : "paid",
    paymentDate: row.payment_date ?? "",
    feeSource: row.fee_source === "class_assignment" ? "class_assignment" : "manual",
  };
}
