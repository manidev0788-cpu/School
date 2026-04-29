"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import FeesSummaryCards from "@/components/fees/FeesSummaryCards";
import FeesTable from "@/components/fees/FeesTable";
import PayFeesModal from "@/components/fees/PayFeesModal";
import ViewFeeModal from "@/components/fees/ViewFeeModal";
import { FEES_STATUS_FILTER_OPTIONS } from "@/lib/fees-data";
import { classDisplayName } from "@/lib/classes-data";
import { feeRowFromJoin } from "@/lib/fees-supabase";
import { rowToStudent } from "@/lib/students-supabase";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase";

export default function FeesPageClient() {
  const configured = isSupabaseConfigured();

  const [students, setStudents] = useState([]);
  const [feeRows, setFeeRows] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(configured);
  const [loadingFees, setLoadingFees] = useState(configured);
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [feeToEdit, setFeeToEdit] = useState(null);
  const [viewRow, setViewRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const loadStudents = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setLoadingStudents(false);
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    setError(null);
    const { data, error: err } = await client.from("students").select("*");
    setLoadingStudents(false);
    if (err) {
      setError(err.message || "Could not load students.");
      setStudents([]);
      return;
    }
    const mapped = (data || []).map(rowToStudent).filter(Boolean);
    mapped.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    setStudents(mapped);
  }, []);

  const loadFees = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setLoadingFees(false);
      setFeeRows([]);
      return;
    }
    setLoadingFees(true);
    setError(null);
    const { data, error: err } = await client
      .from("fees")
      .select(
        `
        id,
        student_id,
        amount,
        status,
        payment_date,
        fee_source,
        student_name,
        class_label,
        students (*)
      `,
      )
      .order("payment_date", { ascending: false });

    setLoadingFees(false);
    if (err) {
      setError(err.message || "Could not load fees.");
      setFeeRows([]);
      return;
    }
    setFeeRows((data || []).map(feeRowFromJoin).filter(Boolean));
  }, []);

  useEffect(() => {
    loadStudents();
    loadFees();
  }, [loadStudents, loadFees]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const t = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const classOptions = useMemo(() => {
    const labels = new Set();
    students.forEach((s) => {
      labels.add(classDisplayName({ grade: s.classGrade, section: s.section }));
    });
    const sorted = Array.from(labels).sort();
    return [{ value: "all", label: "All classes" }, ...sorted.map((v) => ({ value: v, label: v }))];
  }, [students]);

  const filtered = useMemo(() => {
    return feeRows.filter((row) => {
      if (classFilter !== "all" && row.classLabel !== classFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      return true;
    });
  }, [feeRows, classFilter, statusFilter]);

  const summary = useMemo(() => {
    let collected = 0;
    let pending = 0;
    filtered.forEach((row) => {
      if (row.status === "paid") collected += row.amount;
      else pending += row.amount;
    });
    return {
      totalCollected: collected,
      totalPending: pending,
      recordCount: filtered.length,
    };
  }, [filtered]);

  function openCreateModal() {
    setFeeToEdit(null);
    setFeeModalOpen(true);
  }

  function closeFeeModal() {
    setFeeModalOpen(false);
    setFeeToEdit(null);
  }

  async function handleCommit(payload) {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("Supabase is not configured. Add credentials to .env.local and restart the dev server.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (payload.feeId) {
        const { error: upErr } = await client
          .from("fees")
          .update({
            amount: payload.amount,
            status: payload.status,
            payment_date: payload.paymentDate,
          })
          .eq("id", payload.feeId);

        if (upErr) throw upErr;
        setSuccessMessage("Fee record updated.");
      } else {
        const st = students.find((x) => x.id === payload.studentId);
        const classLabel = st ? classDisplayName({ grade: st.classGrade, section: st.section }) : null;
        const { error: insErr } = await client.from("fees").insert({
          student_id: payload.studentId,
          student_name: st?.name ?? null,
          class_label: classLabel,
          amount: payload.amount,
          status: payload.status,
          payment_date: payload.paymentDate,
          fee_source: "manual",
        });

        if (insErr) throw insErr;
        setSuccessMessage("Fee record saved.");
      }

      await loadFees();
      closeFeeModal();
    } catch (e) {
      setError(e?.message || "Could not save fee.");
    } finally {
      setSaving(false);
    }
  }

  const loading = loadingStudents || loadingFees;

  const selectClass =
    "mt-1.5 w-full min-w-[200px] cursor-pointer rounded-full border border-slate-200/90 bg-white py-3 pl-5 pr-10 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12 disabled:opacity-60";

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
    backgroundSize: "1.25rem",
    backgroundPosition: "right 1rem center",
    backgroundRepeat: "no-repeat",
    appearance: "none",
  };

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Fees Management</h1>
            <p className="max-w-2xl text-base font-medium text-slate-500">
              Track fee payments per student — filter by class and status, record paid or pending entries in Supabase.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={!configured || loadingStudents || students.length === 0}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Record fee
          </button>
        </div>

        {!configured && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950" role="status">
            Supabase env vars are missing. Add URL and anon key to <code className="font-mono text-xs">.env.local</code>, run{" "}
            <code className="font-mono text-xs">supabase/ensure_class_fees_schema.sql</code> (or{" "}
            <code className="font-mono text-xs">class_fees.sql</code>), then{" "}
            <code className="font-mono text-xs">supabase/fees.sql</code> (or <code className="font-mono text-xs">fees_assignment_columns.sql</code> if upgrading), then restart the dev server.
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950" role="status">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-950" role="alert">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-rose-800 underline-offset-2 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap">
            <div className="space-y-2">
              <label htmlFor="fees-class-filter" className="block text-sm font-semibold text-slate-700">
                Class
              </label>
              <select
                id="fees-class-filter"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                disabled={loading}
                className={selectClass}
                style={selectStyle}
              >
                {classOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="fees-status-filter" className="block text-sm font-semibold text-slate-700">
                Status
              </label>
              <select
                id="fees-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={loading}
                className={selectClass}
                style={selectStyle}
              >
                {FEES_STATUS_FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <FeesSummaryCards
          totalCollected={summary.totalCollected}
          totalPending={summary.totalPending}
          recordCount={summary.recordCount}
        />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Fee ledger</h2>
          {loading ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-base font-medium text-slate-500">
              Loading fees…
            </p>
          ) : (
            <FeesTable
              rows={filtered}
              onEdit={(row) => {
                setFeeToEdit(row);
                setFeeModalOpen(true);
              }}
              onView={(row) => setViewRow(row)}
            />
          )}
        </div>
      </div>

      <PayFeesModal
        open={feeModalOpen}
        onClose={closeFeeModal}
        students={students}
        feeToEdit={feeToEdit}
        saving={saving}
        onCommit={handleCommit}
      />

      <ViewFeeModal open={Boolean(viewRow)} onClose={() => setViewRow(null)} row={viewRow} />
    </>
  );
}
