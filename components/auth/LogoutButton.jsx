"use client";

import { useRouter } from "next/navigation";
import { clearDemoSession } from "@/lib/auth-client";

export default function LogoutButton({ label = "Sign out" }) {
  const router = useRouter();

  function logout() {
    clearDemoSession();
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
    >
      {label}
    </button>
  );
}
