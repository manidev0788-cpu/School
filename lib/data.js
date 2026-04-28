/** Static dummy data — School ERP dashboard UI */

export const sidebarNav = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { id: "students", label: "Students", href: "/students", icon: "students" },
  { id: "teachers", label: "Teachers", href: "/teachers", icon: "teachers" },
  { id: "classes", label: "Classes", href: "/classes", icon: "classes" },
  { id: "attendance", label: "Attendance", href: "/attendance", icon: "attendance" },
  { id: "fees", label: "Fees", href: "/fees", icon: "fees" },
  { id: "results", label: "Exam & Results", href: "/results", icon: "results" },
  { id: "users", label: "Users", href: "/users", icon: "usersAdmin" },
  { id: "activityLogs", label: "Activity Logs", href: "/activity-logs", icon: "activityLogs" },
  { id: "settings", label: "Settings", href: "/settings", icon: "settings" },
];

export const welcomeProfile = {
  eyebrow: "Welcome back",
  name: "Kate Rivera",
  role: "Lead teacher · Grade 8",
  headline: "Your campus pulse looks strong this week.",
  progressPercent: 72,
  submissionsCleared: 18,
  bodyLead:
    "You've guided learning targets and cleared submissions. Small wins compound for students and families.",
  cta: "Review goals",
};

export const dashboardStats = [
  {
    id: "s1",
    label: "Students enrolled",
    value: "2,847",
    hint: "+124 this term",
    tone: "blue",
    icon: "users",
  },
  {
    id: "s2",
    label: "Attendance",
    value: "96.2%",
    hint: "School-wide avg.",
    tone: "yellow",
    icon: "chart",
  },
  {
    id: "s3",
    label: "Fees cleared",
    value: "₹18.4L",
    hint: "82% of term target",
    tone: "pink",
    icon: "coin",
  },
  {
    id: "s4",
    label: "Teachers active",
    value: "156",
    hint: "Across departments",
    tone: "purple",
    icon: "cap",
  },
];

export const assignments = [
  {
    id: "a1",
    title: "English — Literature circles",
    subject: "English",
    dateLabel: "Due · 20 Jan 2026",
    progress: null,
    badge: "New",
    accent: "emerald",
    icon: "book",
  },
  {
    id: "a2",
    title: "Mathematics III — Algebra",
    subject: "Mathematics",
    dateLabel: "In progress",
    progress: 35,
    badge: null,
    accent: "sky",
    icon: "math",
  },
  {
    id: "a3",
    title: "Medieval History — Unit review",
    subject: "Social studies",
    dateLabel: "In progress",
    progress: 80,
    badge: null,
    accent: "violet",
    icon: "globe",
  },
];

export const lessons = [
  {
    id: "l1",
    title: "Literacy lab",
    subtitle: "English",
    description: "Structured vocabulary blocks & peer feedback loops.",
    gradient: "from-amber-200/95 via-yellow-200 to-amber-100",
    icon: "words",
  },
  {
    id: "l2",
    title: "Innovation studio",
    subtitle: "STEM + arts",
    description: "Hands-on workshops bridging labs and exhibitions.",
    gradient: "from-fuchsia-300/90 via-[#f472b6] to-rose-200",
    icon: "workshop",
  },
];

export const tasksToday = [
  { id: "t1", label: "Grade Period 3 quizzes", meta: "Assignments", dot: "bg-amber-400" },
  { id: "t2", label: "PTA sync · Block B", meta: "Meeting", dot: "bg-emerald-400", highlighted: true },
  { id: "t3", label: "Upload lab safety checklist", meta: "Compliance", dot: "bg-violet-400" },
  { id: "t4", label: "Fee reminders · Grade 9", meta: "Finance", dot: "bg-rose-400" },
];

export const calendar = {
  month: "April",
  year: 2026,
  startWeekday: 3,
  daysInMonth: 30,
  today: 28,
};
