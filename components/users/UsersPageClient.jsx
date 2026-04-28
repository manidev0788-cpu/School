"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import UsersTable from "@/components/users/UsersTable";
import { INITIAL_USERS, generateDummyPassword } from "@/lib/users-data";
import { INITIAL_ACTIVITY_LOGS } from "@/lib/activity-logs-data";
import { notifyLogsUpdated, readLogs, readUsers, writeLogs, writeUsers } from "@/lib/admin-persistence";
import { VIEWER_MODES } from "@/lib/admin-viewer";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-base font-medium text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-[#1d4ed8]/40 focus:bg-white focus:ring-4 focus:ring-[#1d4ed8]/12";

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

function appendActivityLog({ actorName, action, target }) {
  const prev = readLogs(INITIAL_ACTIVITY_LOGS);
  const row = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userName: actorName,
    action,
    target,
    at: new Date().toISOString(),
  };
  writeLogs([row, ...prev]);
  notifyLogsUpdated();
}

export default function UsersPageClient() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [viewerMode, setViewerMode] = useState("super");
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [resetCtx, setResetCtx] = useState(null);
  const [changeUser, setChangeUser] = useState(null);
  const [changePwd, setChangePwd] = useState({ next: "", confirm: "" });
  const [changeError, setChangeError] = useState("");
  const [detailsUser, setDetailsUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [toast, setToast] = useState(null);
  const toastClearRef = useRef(null);

  useEffect(() => {
    setUsers(readUsers(INITIAL_USERS));
    try {
      const v = localStorage.getItem("eskool-viewer-mode");
      if (v === "admin" || v === "super") setViewerMode(v);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeUsers(users);
  }, [users, hydrated]);

  useEffect(() => {
    try {
      localStorage.setItem("eskool-viewer-mode", viewerMode);
    } catch {
      /* ignore */
    }
  }, [viewerMode]);

  const viewer = VIEWER_MODES[viewerMode] ?? VIEWER_MODES.super;
  const fullAccess = viewer.fullAccess;

  function showToast(message) {
    setToast(message);
    if (toastClearRef.current) window.clearTimeout(toastClearRef.current);
    toastClearRef.current = window.setTimeout(() => setToast(null), 2600);
  }

  function handleResetPassword(user) {
    const password = generateDummyPassword();
    setResetCtx({ user, password });
    appendActivityLog({
      actorName: viewer.actorName,
      action: "Reset",
      target: user.username,
    });
  }

  function openChangePassword(user) {
    setChangeUser(user);
    setChangePwd({ next: "", confirm: "" });
    setChangeError("");
  }

  function submitChangePassword(e) {
    e.preventDefault();
    const next = changePwd.next.trim();
    const confirm = changePwd.confirm.trim();
    if (next.length < 8) {
      setChangeError("Use at least 8 characters (demo validation only).");
      return;
    }
    if (next !== confirm) {
      setChangeError("New password and confirmation must match.");
      return;
    }
    appendActivityLog({
      actorName: viewer.actorName,
      action: "Edit",
      target: `${changeUser.username} · password`,
    });
    setChangeUser(null);
    showToast(`Password updated for ${changeUser.username} (demo — not saved to a server).`);
  }

  function openEdit(user) {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email });
  }

  function submitEdit(e) {
    e.preventDefault();
    if (!editUser) return;
    const name = editForm.name.trim();
    const email = editForm.email.trim();
    if (!name || !email) {
      showToast("Name and email are required.");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === editUser.id ? { ...u, name, email } : u)),
    );
    appendActivityLog({
      actorName: viewer.actorName,
      action: "Edit",
      target: editUser.username,
    });
    setEditUser(null);
    showToast("Profile updated (demo).");
  }

  function requestSoftDelete(user) {
    setDeleteTarget(user);
    setDeleteConfirmText("");
  }

  function confirmSoftDelete() {
    if (!deleteTarget) return;
    if (deleteConfirmText !== "DELETE") {
      showToast('Type DELETE exactly to confirm.');
      return;
    }
    const name = deleteTarget.name;
    setUsers((prev) =>
      prev.map((u) => (u.id === deleteTarget.id ? { ...u, status: "Inactive" } : u)),
    );
    appendActivityLog({
      actorName: viewer.actorName,
      action: "Delete",
      target: deleteTarget.username,
    });
    setDeleteTarget(null);
    setDeleteConfirmText("");
    showToast(`${name} marked inactive (soft delete — demo).`);
  }

  function handleRestore(user) {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "Active" } : u)));
    appendActivityLog({
      actorName: viewer.actorName,
      action: "Restore",
      target: user.username,
    });
    showToast(`${user.name} restored to Active.`);
  }

  async function handleCopyPassword() {
    if (!resetCtx) return;
    const ok = await copyToClipboard(resetCtx.password);
    showToast(ok ? "New password copied to clipboard." : "Could not copy — select and copy manually.");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const hay = `${u.name} ${u.role} ${u.username} ${u.status} ${u.email}`.toLowerCase();
      return hay.includes(q);
    });
  }, [users, query]);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === "Active").length;
    return { total: users.length, active };
  }, [users]);

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">User Management</h1>
            <p className="max-w-2xl text-base font-medium text-slate-500">
              Admin directory — roles, account status, and password lifecycle (demo UI; Super Admin vs Admin permissions).
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-[0_8px_30px_rgb(15,23,42,0.05)] ring-1 ring-slate-200/70">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Accounts</p>
              <p className="text-2xl font-extrabold tabular-nums text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 shadow-[0_8px_30px_rgb(15,23,42,0.05)] ring-1 ring-slate-200/70">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Active</p>
              <p className="text-2xl font-extrabold tabular-nums text-emerald-700">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_8px_30px_rgb(15,23,42,0.05)] ring-1 ring-slate-200/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Demo viewer</p>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Simulate who is signed in. <strong className="font-semibold text-slate-900">Super Admin</strong> has full actions;
              <strong className="font-semibold text-slate-900"> Admin</strong> can view and edit profiles only.
            </p>
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-slate-50/80 p-1 shadow-inner">
            {(["super", "admin"]).map((key) => {
              const m = VIEWER_MODES[key];
              const on = viewerMode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setViewerMode(key)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                    on ? "bg-white text-[#1d4ed8] shadow-sm ring-1 ring-slate-200/90" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-linear-to-r from-amber-50/90 to-white px-5 py-4 shadow-inner shadow-amber-100/50 ring-1 ring-amber-100/80">
          <p className="text-sm font-semibold text-amber-950">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/80 text-xs font-extrabold text-amber-950">
              !
            </span>
            Security (UI demo): passwords are never shown. Deletes are <strong className="font-bold">soft</strong> (status → Inactive). Confirmation requires typing{" "}
            <span className="font-mono font-bold">DELETE</span>.
          </p>
        </div>

        <div className="relative max-w-xl">
          <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </span>
          <label htmlFor="users-search" className="sr-only">
            Search users
          </label>
          <input
            id="users-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, username, or email…"
            className="w-full rounded-full border border-slate-200/90 bg-white py-3.5 pl-14 pr-5 text-base font-medium text-slate-800 shadow-inner shadow-slate-100/80 outline-none ring-[#1d4ed8]/0 transition placeholder:text-slate-400 focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Directory</h2>
          <UsersTable
            users={filtered}
            fullAccess={fullAccess}
            onResetPassword={handleResetPassword}
            onChangePassword={openChangePassword}
            onViewDetails={setDetailsUser}
            onEditUser={openEdit}
            onSoftDelete={requestSoftDelete}
            onRestore={handleRestore}
          />
        </div>
      </div>

      <Modal
        open={!!resetCtx}
        onClose={() => setResetCtx(null)}
        title="Password reset"
        description="A new temporary password has been generated (demo)."
        panelClassName="max-w-md"
      >
        {resetCtx ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Username</dt>
                  <dd className="mt-1 font-mono text-base font-bold text-slate-900">{resetCtx.user.username}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">New password</dt>
                  <dd className="mt-1 break-all font-mono text-base font-bold tracking-wide text-[#1d4ed8]">{resetCtx.password}</dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopyPassword}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy new password
              </button>
              <button
                type="button"
                onClick={() => setResetCtx(null)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={!!changeUser}
        onClose={() => setChangeUser(null)}
        title={changeUser ? `Change password · ${changeUser.username}` : "Change password"}
        description="Enter a new password below. Previous passwords are never shown."
        panelClassName="max-w-md"
      >
        {changeUser ? (
          <form onSubmit={submitChangePassword} className="space-y-5">
            <div className="rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm font-medium text-sky-950">
              Set a <strong className="font-bold">new password</strong> only — we never display or ask for the current password in this demo.
            </div>
            <div>
              <label htmlFor="um-new-pwd" className="block text-sm font-semibold text-slate-700">
                New password
              </label>
              <input
                id="um-new-pwd"
                type="password"
                autoComplete="new-password"
                value={changePwd.next}
                onChange={(e) => {
                  setChangePwd((p) => ({ ...p, next: e.target.value }));
                  setChangeError("");
                }}
                className={inputClass}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <label htmlFor="um-confirm-pwd" className="block text-sm font-semibold text-slate-700">
                Confirm new password
              </label>
              <input
                id="um-confirm-pwd"
                type="password"
                autoComplete="new-password"
                value={changePwd.confirm}
                onChange={(e) => {
                  setChangePwd((p) => ({ ...p, confirm: e.target.value }));
                  setChangeError("");
                }}
                className={inputClass}
                placeholder="Repeat new password"
              />
            </div>
            {changeError ? (
              <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800" role="alert">
                {changeError}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setChangeUser(null)} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af]">
                Save new password
              </button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title={editUser ? `Edit user · ${editUser.username}` : "Edit user"}
        description="Update display name and email (demo)."
        panelClassName="max-w-md"
      >
        {editUser ? (
          <form onSubmit={submitEdit} className="space-y-5">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-semibold text-slate-700">
                Full name
              </label>
              <input
                id="edit-name"
                name="name"
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                id="edit-email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setEditUser(null)} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af]">
                Save changes
              </button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => {
          setDeleteTarget(null);
          setDeleteConfirmText("");
        }}
        title="Deactivate account?"
        description={
          deleteTarget
            ? `This will set ${deleteTarget.name} (${deleteTarget.username}) to Inactive — records stay in the system.`
            : ""
        }
        panelClassName="max-w-md"
      >
        {deleteTarget ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-950">
              Type <span className="rounded bg-white px-1.5 py-0.5 font-mono font-bold text-rose-900">DELETE</span> to confirm a soft delete (demo).
            </div>
            <div>
              <label htmlFor="delete-confirm-input" className="block text-sm font-semibold text-slate-700">
                Confirmation
              </label>
              <input
                id="delete-confirm-input"
                type="text"
                autoComplete="off"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className={inputClass}
                placeholder="DELETE"
              />
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteConfirmText("");
                }}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSoftDelete}
                disabled={deleteConfirmText !== "DELETE"}
                className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Deactivate user
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={!!detailsUser}
        onClose={() => setDetailsUser(null)}
        title={detailsUser ? detailsUser.name : "User details"}
        description="Account overview (no credentials shown)."
        panelClassName="max-w-lg"
      >
        {detailsUser ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Display name</dt>
              <dd className="mt-1 text-base font-bold text-slate-900">{detailsUser.name}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-inner">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Role</dt>
              <dd className="mt-1 font-semibold text-slate-900">{detailsUser.role}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-inner">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</dt>
              <dd className="mt-1 font-semibold text-slate-900">{detailsUser.status}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-inner sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Username</dt>
              <dd className="mt-1 font-mono text-sm font-bold text-slate-900">{detailsUser.username}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-inner sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 break-all text-sm font-medium text-slate-800">{detailsUser.email}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-inner sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Linked profile</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">{detailsUser.linkedProfile}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-inner">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Created</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">{detailsUser.createdAt}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-inner">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Last login</dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">{detailsUser.lastLoginAt}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      {toast ? (
        <div className="fixed bottom-8 left-1/2 z-110 max-w-md -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-semibold text-slate-900 shadow-[0_24px_80px_-12px_rgb(15,23,42,0.25)] ring-1 ring-slate-200/80">
          {toast}
        </div>
      ) : null}
    </>
  );
}
