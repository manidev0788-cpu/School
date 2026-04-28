/** Dummy users — Admin User Management UI (no backend) */

export const USER_ROLES = ["Student", "Teacher", "Parent", "Admin", "Super Admin"];

export const USER_STATUSES = ["Active", "Inactive"];

export const INITIAL_USERS = [
  {
    id: "usr-8",
    name: "Amelia Wright",
    role: "Super Admin",
    username: "amelia.wright",
    status: "Active",
    email: "amelia.wright@eskool.edu",
    linkedProfile: "Head of IT · Full access",
    createdAt: "2022-03-01",
    lastLoginAt: "2026-04-28 08:02",
  },
  {
    id: "usr-9",
    name: "James Kumar",
    role: "Admin",
    username: "james.kumar",
    status: "Active",
    email: "james.kumar@eskool.edu",
    linkedProfile: "Records · Limited access",
    createdAt: "2023-07-15",
    lastLoginAt: "2026-04-27 15:18",
  },
  {
    id: "usr-1",
    name: "Aditi Sharma",
    role: "Student",
    username: "aditi.sharma",
    status: "Active",
    email: "aditi.sharma@student.eskool.edu",
    linkedProfile: "Grade 9 · Section A",
    createdAt: "2024-06-12",
    lastLoginAt: "2026-04-27 09:14",
  },
  {
    id: "usr-2",
    name: "Vihaan Mehta",
    role: "Student",
    username: "vihaan.mehta",
    status: "Active",
    email: "vihaan.mehta@student.eskool.edu",
    linkedProfile: "Grade 9 · Section B",
    createdAt: "2024-06-12",
    lastLoginAt: "2026-04-26 16:02",
  },
  {
    id: "usr-3",
    name: "Neha Krishnan",
    role: "Teacher",
    username: "neha.krishnan",
    status: "Active",
    email: "neha.krishnan@eskool.edu",
    linkedProfile: "Mathematics · Middle school",
    createdAt: "2023-01-08",
    lastLoginAt: "2026-04-28 07:55",
  },
  {
    id: "usr-4",
    name: "David Fernandes",
    role: "Teacher",
    username: "david.fernandes",
    status: "Inactive",
    email: "david.fernandes@eskool.edu",
    linkedProfile: "Science · Labs coordinator",
    createdAt: "2022-08-01",
    lastLoginAt: "2026-03-02 11:20",
  },
  {
    id: "usr-5",
    name: "Rajesh Sharma",
    role: "Parent",
    username: "rajesh.sharma",
    status: "Active",
    email: "rajesh.sharma@gmail.com",
    linkedProfile: "Guardian · Aditi Sharma",
    createdAt: "2024-06-12",
    lastLoginAt: "2026-04-25 19:41",
  },
  {
    id: "usr-6",
    name: "Priya Mehta",
    role: "Parent",
    username: "priya.mehta",
    status: "Active",
    email: "priya.mehta@yahoo.com",
    linkedProfile: "Guardian · Vihaan Mehta",
    createdAt: "2024-06-12",
    lastLoginAt: "2026-04-27 08:05",
  },
  {
    id: "usr-7",
    name: "Arjun Desai",
    role: "Student",
    username: "arjun.desai",
    status: "Inactive",
    email: "arjun.desai@student.eskool.edu",
    linkedProfile: "Grade 10 · Section B",
    createdAt: "2023-06-01",
    lastLoginAt: "2026-01-14 14:33",
  },
];

/** Demo-only: pseudo-random password for reset-password UI */
export function generateDummyPassword(length = 14) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const nums = "23456789";
  const sym = "@#$%&";
  const chars = upper + lower + nums + sym;
  const required = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    nums[Math.floor(Math.random() * nums.length)],
    sym[Math.floor(Math.random() * sym.length)],
  ];
  const rest = [];
  for (let i = required.length; i < length; i++) {
    rest.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  const combined = [...required, ...rest];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}
