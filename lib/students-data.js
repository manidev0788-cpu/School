export const CLASS_OPTIONS = [
  "Nursery",
  "LKG",
  "UKG",
  ...Array.from({ length: 12 }, (_, i) => String(i + 1)),
];

/** Section letters — matches typical classroom splits */
export const SECTION_OPTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Annual tuition (₹) by class ladder: Nursery 2000, LKG 2500, then +500 per step through 12th.
 */
export function tuitionForClassGrade(classGrade) {
  const key = typeof classGrade === "string" ? classGrade.trim() : "";
  if (!key) return null;
  const idx = CLASS_OPTIONS.indexOf(key);
  if (idx < 0) return null;
  return 2000 + 500 * idx;
}

export const GENDER_OPTIONS = [
  { value: "", label: "Select" },
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Other", label: "Other" },
];

/** Day dropdown values 01–31 */
export const DOB_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const n = i + 1;
  const value = String(n).padStart(2, "0");
  return { value, label: String(n) };
});

/** Month dropdown Jan–Dec → values 01–12 */
export const DOB_MONTH_OPTIONS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

/** Years descending: 1990 … current calendar year (inclusive) */
export function getDobYearOptions() {
  const end = new Date().getFullYear();
  const start = 1990;
  const years = [];
  for (let y = end; y >= start; y -= 1) years.push(String(y));
  return years;
}

/** Years descending for admission dates (e.g. 2000 … current+2). */
export function getAdmissionYearOptions() {
  const end = new Date().getFullYear() + 2;
  const start = 2000;
  const years = [];
  for (let y = end; y >= start; y -= 1) years.push(String(y));
  return years;
}

/** Parse YYYY-MM-DD into dob_year / dob_month / dob_day for controlled selects */
export function splitIsoDateToDobParts(iso) {
  if (!iso || typeof iso !== "string") return { dob_day: "", dob_month: "", dob_year: "" };
  const m = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return { dob_day: "", dob_month: "", dob_year: "" };
  return { dob_year: m[1], dob_month: m[2], dob_day: m[3] };
}

export function isValidDobParts(yearStr, monthStr, dayStr) {
  const y = Number.parseInt(String(yearStr ?? "").trim(), 10);
  const mo = Number.parseInt(String(monthStr ?? "").trim(), 10);
  const d = Number.parseInt(String(dayStr ?? "").trim(), 10);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return false;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}

/** Combine dob_* or admission_* parts into `YYYY-MM-DD` or empty string */
export function formatStudentDobForDb(student) {
  const y = String(student?.dob_year ?? "").trim();
  const mo = String(student?.dob_month ?? "").trim();
  const d = String(student?.dob_day ?? "").trim();
  if (!y || !mo || !d) return "";
  const dd = String(Number.parseInt(d, 10)).padStart(2, "0");
  const mm = String(Number.parseInt(mo, 10)).padStart(2, "0");
  const iso = `${y}-${mm}-${dd}`;
  if (!isValidDobParts(y, mo, d)) return "";
  return iso;
}

/** Full form shape for add/edit (stepper). */
export function emptyStudentForm() {
  return {
    /** Readable registry id — set by server-side logic on insert only; display-only in UI */
    studentId: "",
    name: "",
    classGrade: "",
    section: "",
    rollNo: "",
    /** INR annual tuition stored on student row (defaults from catalog on save if blank) */
    tuition: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    gender: "",
    father_name: "",
    father_phone: "",
    father_occupation: "",
    father_qualification: "",
    mother_name: "",
    mother_phone: "",
    mother_occupation: "",
    mother_qualification: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    /** Canonical ISO date string for display/summary (kept in sync with admission parts). */
    admissionDate: "",
    /** Day / month / year selects — source of truth for DB admission_date */
    admission_day: "",
    admission_month: "",
    admission_year: "",
    previousSchool: "",
    famousLandmark: "",
    profileImage: "",
  };
}
