"use client";

import { AUTH_COOKIE, AUTH_STORAGE_KEY } from "@/lib/auth-config";

const WEEK = 60 * 60 * 24 * 7;

/** Persist demo session (cookie for middleware + localStorage for client UI). */
export function setDemoSession(role, email) {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${WEEK}; SameSite=Lax`;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role, email }));
  } catch {
    /* ignore */
  }
}

export function clearDemoSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
