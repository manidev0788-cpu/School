"use client";

import { Card } from "@/components/ui/Card";

const btnBase =
  "rounded-xl border bg-white px-3 py-2 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-45";

function roleBadgeClass(role) {
  if (role === "Student") return "bg-sky-50 text-sky-900 ring-sky-100";
  if (role === "Teacher") return "bg-violet-50 text-violet-900 ring-violet-100";
  if (role === "Parent") return "bg-amber-50 text-amber-950 ring-amber-100";
  if (role === "Super Admin") return "bg-indigo-50 text-indigo-950 ring-indigo-100";
  if (role === "Admin") return "bg-slate-100 text-slate-900 ring-slate-200";
  return "bg-slate-50 text-slate-800 ring-slate-100";
}

function statusBadgeClass(status) {
  return status === "Active"
    ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
    : "bg-rose-50 text-rose-900 ring-rose-100";
}

export default function UsersTable({
  users,
  fullAccess,
  onResetPassword,
  onChangePassword,
  onViewDetails,
  onEditUser,
  onSoftDelete,
  onRestore,
}) {
  return (
    <Card className="overflow-hidden border border-white/80 p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Name
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Role
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Username
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Status
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-base font-medium text-slate-500">
                  No users match your search.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="transition hover:bg-[#1d4ed8]/3">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{u.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${roleBadgeClass(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-800">{u.username}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ring-1 ring-inset ${statusBadgeClass(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewDetails(u)}
                        className={`${btnBase} border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50`}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditUser(u)}
                        className={`${btnBase} border-[#1d4ed8]/35 text-[#1d4ed8] hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5`}
                      >
                        Edit
                      </button>

                      {fullAccess ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onChangePassword(u)}
                            className={`${btnBase} border-[#1d4ed8]/35 text-[#1d4ed8] hover:border-[#1d4ed8] hover:bg-[#1d4ed8]/5`}
                          >
                            Change password
                          </button>
                          <button
                            type="button"
                            onClick={() => onResetPassword(u)}
                            className={`${btnBase} border-slate-200 text-slate-700 hover:border-[#1d4ed8]/35 hover:bg-[#1d4ed8]/5 hover:text-[#1d4ed8]`}
                          >
                            Reset password
                          </button>
                          {u.status === "Inactive" ? (
                            <button
                              type="button"
                              onClick={() => onRestore(u)}
                              className={`${btnBase} border-emerald-200 bg-emerald-50/80 text-emerald-900 hover:border-emerald-300`}
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onSoftDelete(u)}
                              className={`${btnBase} border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50`}
                            >
                              Delete
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
