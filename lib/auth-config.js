/** Demo auth — shared constants (Edge-safe: no browser APIs) */

export const AUTH_COOKIE = "eskool_role";
export const AUTH_STORAGE_KEY = "eskool_session";

/** email → { password, role } */
export const DEMO_USERS = {
  "admin@demo.com": { password: "123456", role: "admin" },
  "teacher@demo.com": { password: "123456", role: "teacher" },
  "parent@demo.com": { password: "123456", role: "parent" },
};

export const ROLE_HOME = {
  admin: "/dashboard",
  teacher: "/teacher-dashboard",
  parent: "/parent-dashboard",
};

/** Paths that never require login */
export const PUBLIC_PATHS = new Set(["/", "/landing"]);

/** Admin ERP routes (prefix match) */
export const ADMIN_ROUTE_PREFIXES = [
  "/dashboard",
  "/students",
  "/teachers",
  "/classes",
  "/attendance",
  "/fees",
  "/results",
  "/users",
  "/activity-logs",
  "/settings",
];

export function matchesAdminRoute(pathname) {
  return ADMIN_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function matchesTeacherRoute(pathname) {
  return pathname === "/teacher-dashboard" || pathname.startsWith("/teacher-dashboard/");
}

export function matchesParentRoute(pathname) {
  return pathname === "/parent-dashboard" || pathname.startsWith("/parent-dashboard/");
}
