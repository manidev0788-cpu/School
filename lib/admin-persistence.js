/** Client-side persistence for admin demo (no API) */

const USERS_KEY = "eskool-admin-users-v1";
const LOGS_KEY = "eskool-admin-logs-v1";

export function readUsers(fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeUsers(users) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore quota */
  }
}

export function readLogs(fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeLogs(logs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch {
    /* ignore */
  }
}

export function notifyLogsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("eskool-logs-updated"));
}
