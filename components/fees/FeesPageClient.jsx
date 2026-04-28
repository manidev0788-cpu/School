"use client";

import { useMemo, useState } from "react";
import FeesSummaryCards from "@/components/fees/FeesSummaryCards";
import FeesTable from "@/components/fees/FeesTable";
import PayFeesModal from "@/components/fees/PayFeesModal";
import ViewFeeModal from "@/components/fees/ViewFeeModal";
import {
  FEES_CLASS_OPTIONS,
  FEES_STATUS_FILTER_OPTIONS,
  INITIAL_FEE_ROWS,
  feeStatus,
} from "@/lib/fees-data";

export default function FeesPageClient() {
  const [rows, setRows] = useState(INITIAL_FEE_ROWS);
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payRow, setPayRow] = useState(null);
  const [viewRow, setViewRow] = useState(null);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (classFilter !== "all" && row.classLabel !== classFilter) return false;
      if (statusFilter !== "all" && feeStatus(row) !== statusFilter) return false;
      return true;
    });
  }, [rows, classFilter, statusFilter]);

  const summary = useMemo(() => {
    let collected = 0;
    let pending = 0;
    filtered.forEach((row) => {
      collected += row.paidAmount;
      pending += Math.max(0, row.totalFees - row.paidAmount);
    });
    return {
      totalCollected: collected,
      totalPending: pending,
      totalStudents: filtered.length,
    };
  }, [filtered]);

  function handlePayment(rowId, amount) {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, paidAmount: Math.min(r.totalFees, r.paidAmount + amount) } : r)),
    );
  }

  const selectClass =
    "mt-1.5 w-full min-w-[200px] cursor-pointer rounded-full border border-slate-200/90 bg-white py-3 pl-5 pr-10 text-base font-semibold text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/35 focus:ring-4 focus:ring-[#1d4ed8]/12";

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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Fees Management</h1>
          <p className="max-w-2xl text-base font-medium text-slate-500">
            Track tuition and contributions — filter by class, review balances, and record payments (demo data only).
          </p>
        </div>

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
                className={selectClass}
                style={selectStyle}
              >
                {FEES_CLASS_OPTIONS.map((o) => (
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
          totalStudents={summary.totalStudents}
        />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Fee ledger</h2>
          <FeesTable rows={filtered} onPay={(row) => setPayRow(row)} onView={(row) => setViewRow(row)} />
        </div>
      </div>

      <PayFeesModal
        open={Boolean(payRow)}
        onClose={() => setPayRow(null)}
        row={payRow}
        onSubmitPayment={(rowId, amount) => handlePayment(rowId, amount)}
      />

      <ViewFeeModal open={Boolean(viewRow)} onClose={() => setViewRow(null)} row={viewRow} />
    </>
  );
}
