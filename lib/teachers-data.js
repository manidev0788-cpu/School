/** Static dummy data — Teacher Management UI */

export const TEACHER_SUBJECT_OPTIONS = [
  { value: "all", label: "All subjects" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "Science", label: "Science" },
  { value: "Social Studies", label: "Social Studies" },
  { value: "Hindi", label: "Hindi" },
  { value: "Computer Science", label: "Computer Science" },
];

export const TEACHER_CLASS_OPTIONS = [
  { value: "all", label: "All classes" },
  { value: "Class 8A", label: "Class 8A" },
  { value: "Class 8B", label: "Class 8B" },
  { value: "Class 9A", label: "Class 9A" },
  { value: "Class 9B", label: "Class 9B" },
  { value: "Class 10A", label: "Class 10A" },
];

/** Dropdown values for form (no "all") */
export const FORM_SUBJECT_OPTIONS = TEACHER_SUBJECT_OPTIONS.filter((o) => o.value !== "all");
export const FORM_CLASS_OPTIONS = TEACHER_CLASS_OPTIONS.filter((o) => o.value !== "all");

export const INITIAL_TEACHERS = [
  {
    id: "t-1",
    name: "Priya Menon",
    subject: "Mathematics",
    assignedClass: "Class 9A",
    phone: "+91 98765 43201",
    email: "priya.menon@eskool.edu",
  },
  {
    id: "t-2",
    name: "Rajesh Iyer",
    subject: "Science",
    assignedClass: "Class 9B",
    phone: "+91 98765 43202",
    email: "rajesh.iyer@eskool.edu",
  },
  {
    id: "t-3",
    name: "Ananya Das",
    subject: "English",
    assignedClass: "Class 8A",
    phone: "+91 98765 43203",
    email: "ananya.das@eskool.edu",
  },
  {
    id: "t-4",
    name: "Karthik Nair",
    subject: "Social Studies",
    assignedClass: "Class 10A",
    phone: "+91 98765 43204",
    email: "karthik.nair@eskool.edu",
  },
  {
    id: "t-5",
    name: "Sunita Rao",
    subject: "Hindi",
    assignedClass: "Class 8B",
    phone: "+91 98765 43205",
    email: "sunita.rao@eskool.edu",
  },
  {
    id: "t-6",
    name: "Dev Patel",
    subject: "Computer Science",
    assignedClass: "Class 10A",
    phone: "+91 98765 43206",
    email: "dev.patel@eskool.edu",
  },
  {
    id: "t-7",
    name: "Meera Krishnan",
    subject: "Mathematics",
    assignedClass: "Class 8A",
    phone: "+91 98765 43207",
    email: "meera.krishnan@eskool.edu",
  },
];
