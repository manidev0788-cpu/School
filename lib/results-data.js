/** Exam / Results module — static data & grade helpers */

export const RESULT_CLASS_OPTIONS = [
  { value: "all", label: "All classes" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
];

export const RESULT_SECTION_OPTIONS = [
  { value: "all", label: "All sections" },
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
];

export const RESULT_EXAM_OPTIONS = [
  { value: "all", label: "All exams" },
  { value: "unit1", label: "Unit test I" },
  { value: "midterm", label: "Midterm" },
  { value: "final", label: "Final" },
];

/** Marks per subject (each out of 100). */
export const SUBJECT_KEYS = ["math", "english", "science"];

export const SUBJECT_LABELS = {
  math: "Math",
  english: "English",
  science: "Science",
};

export const MARKS_PER_SUBJECT = 100;
export const TOTAL_MARKS_MAX = MARKS_PER_SUBJECT * SUBJECT_KEYS.length;

/** Dummy ledger rows — edited in-memory on client */
export const INITIAL_RESULT_ROWS = [
  {
    id: "res-1",
    studentName: "Aditi Sharma",
    rollNo: "901",
    classNum: "9",
    section: "A",
    exam: "midterm",
    math: 88,
    english: 82,
    science: 91,
  },
  {
    id: "res-2",
    studentName: "Vihaan Mehta",
    rollNo: "902",
    classNum: "9",
    section: "A",
    exam: "midterm",
    math: 72,
    english: 68,
    science: 75,
  },
  {
    id: "res-3",
    studentName: "Kabir Khan",
    rollNo: "903",
    classNum: "9",
    section: "B",
    exam: "midterm",
    math: 94,
    english: 90,
    science: 96,
  },
  {
    id: "res-4",
    studentName: "Meera Nair",
    rollNo: "801",
    classNum: "8",
    section: "A",
    exam: "midterm",
    math: 65,
    english: 70,
    science: 62,
  },
  {
    id: "res-5",
    studentName: "Dhruv Khanna",
    rollNo: "804",
    classNum: "8",
    section: "B",
    exam: "midterm",
    math: 55,
    english: 58,
    science: 52,
  },
  {
    id: "res-6",
    studentName: "Viraj Anand",
    rollNo: "1001",
    classNum: "10",
    section: "A",
    exam: "final",
    math: 91,
    english: 88,
    science: 93,
  },
  {
    id: "res-7",
    studentName: "Myra Saxena",
    rollNo: "1002",
    classNum: "10",
    section: "A",
    exam: "final",
    math: 78,
    english: 85,
    science: 80,
  },
  {
    id: "res-8",
    studentName: "Shaurya Dutta",
    rollNo: "904",
    classNum: "9",
    section: "B",
    exam: "unit1",
    math: 62,
    english: 59,
    science: 64,
  },
];

export function sumMarks(row) {
  return SUBJECT_KEYS.reduce((acc, k) => acc + (Number(row[k]) || 0), 0);
}

/** Percentage out of TOTAL_MARKS_MAX */
export function percentageFromRow(row) {
  const t = sumMarks(row);
  return Math.round(((t / TOTAL_MARKS_MAX) * 100 + Number.EPSILON) * 10) / 10;
}

/** Letter grade from percentage — dummy tiering */
export function gradeLetter(pct) {
  if (pct >= 85) return "A";
  if (pct >= 70) return "B";
  if (pct >= 55) return "C";
  return "D";
}

export function gradeBadgeTone(letter) {
  const map = {
    A: "border-emerald-300/90 bg-emerald-100 text-emerald-900 ring-emerald-200",
    B: "border-sky-300/90 bg-sky-100 text-sky-900 ring-sky-200",
    C: "border-amber-300/90 bg-amber-100 text-amber-950 ring-amber-200",
    D: "border-slate-300/90 bg-slate-100 text-slate-800 ring-slate-200",
  };
  return map[letter] || map.D;
}
