/** Static dummy data — Attendance module UI */

/** Class groups shown in the selector (e.g. Class 1A, 2B). */
export const ATTENDANCE_CLASSES = [
  { id: "1a", label: "Class 1A" },
  { id: "1b", label: "Class 1B" },
  { id: "2a", label: "Class 2A" },
  { id: "2b", label: "Class 2B" },
  { id: "3a", label: "Class 3A" },
];

/** Students per class id — name + roll for the roster table. */
export const STUDENTS_BY_CLASS = {
  "1a": [
    { id: "1a-1", name: "Riya Kapoor", rollNo: "101" },
    { id: "1a-2", name: "Vihaan Singh", rollNo: "102" },
    { id: "1a-3", name: "Anika Bose", rollNo: "103" },
    { id: "1a-4", name: "Kabir Malhotra", rollNo: "104" },
  ],
  "1b": [
    { id: "1b-1", name: "Neha Verma", rollNo: "111" },
    { id: "1b-2", name: "Arjun Pillai", rollNo: "112" },
    { id: "1b-3", name: "Ishaan Reddy", rollNo: "113" },
  ],
  "2a": [
    { id: "2a-1", name: "Meera Nambiar", rollNo: "201" },
    { id: "2a-2", name: "Dhruv Khanna", rollNo: "202" },
    { id: "2a-3", name: "Saanvi Menon", rollNo: "203" },
    { id: "2a-4", name: "Reyansh Gupta", rollNo: "204" },
    { id: "2a-5", name: "Pari Sethi", rollNo: "205" },
  ],
  "2b": [
    { id: "2b-1", name: "Advik Rao", rollNo: "211" },
    { id: "2b-2", name: "Kiara Joshi", rollNo: "212" },
  ],
  "3a": [
    { id: "3a-1", name: "Viraj Anand", rollNo: "301" },
    { id: "3a-2", name: "Myra Saxena", rollNo: "302" },
    { id: "3a-3", name: "Shaurya Dutta", rollNo: "303" },
  ],
};
