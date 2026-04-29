/**
 * Maps DB rows ↔ form/student objects (mixed casing: classGrade camelCase; guardian fields snake_case ↔ DB).
 */

import { formatStudentDobForDb, splitIsoDateToDobParts } from "./students-data.js";

/** Resolve display name from a students row */
export function studentNameFromRow(row) {
  if (!row) return "";
  const v = row.name ?? row.full_name ?? row.student_name;
  return typeof v === "string" ? v : "";
}

/** Map `"class"` column or legacy class_grade */
export function studentClassFromRow(row) {
  if (!row) return "";
  const v = row["class"] ?? row.class_grade;
  return typeof v === "string" ? v : "";
}

function rollFromRow(row) {
  const r = row.roll_number ?? row.roll_no;
  if (r === null || r === undefined) return "";
  return String(r);
}

function tuitionFromRow(row) {
  const t = row.tuition;
  if (t === null || t === undefined) return null;
  const n = typeof t === "number" ? t : Number.parseInt(String(t), 10);
  return Number.isFinite(n) ? n : null;
}

/** Normalize Postgres date | timestamptz | text → YYYY-MM-DD */
function isoDateOnly(val) {
  if (val == null || val === "") return "";
  if (typeof val === "string") {
    const m = val.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : "";
  }
  if (val instanceof Date && !Number.isNaN(val.getTime())) return val.toISOString().slice(0, 10);
  return String(val).slice(0, 10);
}

/** Prefer date_of_birth (canonical DATE), then dob (legacy mirror). */
function dobIsoFromRow(row) {
  if (!row) return "";
  const d = row.date_of_birth ?? row.dob;
  if (d == null || d === "") return "";
  return isoDateOnly(d);
}

export function rowToStudent(row) {
  if (!row) return null;
  const dobIso = dobIsoFromRow(row);
  const admissionIso =
    row.admission_date != null && row.admission_date !== "" ? isoDateOnly(row.admission_date) : "";

  return {
    id: row.id,
    studentId: row.student_id != null && row.student_id !== "" ? String(row.student_id).trim() : "",
    name: studentNameFromRow(row),
    classGrade: studentClassFromRow(row),
    section: row.section ?? "",
    rollNo: rollFromRow(row),
    tuition: tuitionFromRow(row),
    dateOfBirth: dobIso,
    ...splitIsoDateToDobParts(dobIso),
    gender: row.gender ?? "",
    father_name: String(row.father_name ?? "").trim(),
    father_phone: String(row.father_phone ?? "").trim(),
    father_occupation: row.father_occupation ?? "",
    father_qualification: row.father_qualification ?? "",
    mother_name: String(row.mother_name ?? "").trim(),
    mother_phone: String(row.mother_phone ?? "").trim(),
    mother_occupation: row.mother_occupation ?? "",
    mother_qualification: row.mother_qualification ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    zipCode: row.zip_code ?? "",
    admissionDate: admissionIso,
    previousSchool: row.previous_school ?? "",
    famousLandmark: row.famous_landmark ?? "",
    profileImage: typeof row.profile_image === "string" && row.profile_image.trim() !== "" ? row.profile_image.trim() : "",
  };
}

function parseRollNumberBits(student) {
  const raw = student.rollNo ?? "";
  const digits = String(raw).replace(/\D/g, "");
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

function parseTuitionBits(student, catalogFallback) {
  const raw = student.tuition;
  if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
    const n = Number.parseInt(String(raw).replace(/\D/g, ""), 10);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  if (typeof catalogFallback === "number" && Number.isFinite(catalogFallback) && catalogFallback >= 0) {
    return catalogFallback;
  }
  return 0;
}

function nullableTrim(str) {
  const s = typeof str === "string" ? str.trim() : String(str ?? "").trim();
  return s === "" ? null : s;
}

/** Exact DB payload — date_of_birth + dob (same DATE); admission_date; guardian columns match Postgres. */
export function buildStudentPayload(form, catalogTuitionFallback = null) {
  const dateIso = formatStudentDobForDb(form);
  const date_of_birth = dateIso === "" ? null : dateIso;

  /** Prefer explicit admission_day/month/year; fallback to admissionDate string (legacy). */
  const admissionFromParts = formatStudentDobForDb({
    dob_day: form.admission_day,
    dob_month: form.admission_month,
    dob_year: form.admission_year,
  });
  const admissionCombined =
    (typeof admissionFromParts === "string" && admissionFromParts.trim() !== "" ? admissionFromParts.trim() : "") ||
    String(form.admissionDate ?? "").trim();
  let admission_date = null;
  if (admissionCombined) {
    const m = admissionCombined.match(/^(\d{4}-\d{2}-\d{2})/);
    admission_date = m ? m[1] : null;
  }

  const rollNum = parseRollNumberBits(form);
  const tuitionNum = parseTuitionBits(form, catalogTuitionFallback);
  const profileImageUrl = nullableTrim(form.profileImage);

  return {
    name: String(form.name ?? "").trim() || "Unknown",
    ["class"]: String(form.classGrade ?? "").trim(),
    section: String(form.section ?? "").trim(),
    roll_number: Number.isFinite(rollNum) ? rollNum : 0,
    tuition: Number.isFinite(tuitionNum) && tuitionNum >= 0 ? tuitionNum : 0,
    date_of_birth,
    dob: date_of_birth,
    father_name: nullableTrim(form.father_name),
    father_phone: nullableTrim(form.father_phone),
    father_occupation: nullableTrim(form.father_occupation),
    father_qualification: nullableTrim(form.father_qualification),
    mother_name: nullableTrim(form.mother_name),
    mother_phone: nullableTrim(form.mother_phone),
    mother_occupation: nullableTrim(form.mother_occupation),
    mother_qualification: nullableTrim(form.mother_qualification),
    address: nullableTrim(form.address),
    city: nullableTrim(form.city),
    famous_landmark: nullableTrim(form.famousLandmark),
    admission_date,
    // Omit when unset so PostgREST does not require `profile_image` until the column exists (ensure_students_schema.sql).
    ...(profileImageUrl != null ? { profile_image: profileImageUrl } : {}),
  };
}

/** @deprecated alias — same as buildStudentPayload */
export const studentToRow = buildStudentPayload;
