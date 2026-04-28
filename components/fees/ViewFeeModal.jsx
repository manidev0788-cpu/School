"use client";

import Modal from "@/components/ui/Modal";
import { feeDue, feeStatus, formatInr } from "@/lib/fees-data";

function StatusBadge({ status }) {
  const map = {
    paid: "border-emerald-300/90 bg-emerald-100 text-emerald-900 ring-emerald-200",
    unpaid: "border-rose-300/90 bg-rose-100 text-rose-900 ring-rose-200",
    partial: "border-amber-300/90 bg-amber-100 text-amber-950 ring-amber-200",
  };
  const label = status === "paid" ? "Paid" : status === "partial" ? "Partial" : "Unpaid";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${map[status] || map.unpaid}`}>
      {label}
    </span>
  );
}

export default function ViewFeeModal({ open, onClose, row }) {
  if (!row) return null;
  const due = feeDue(row);
  const status = feeStatus(row);

  return (
    <Modal open={open} onClose={onClose} title="Fee details" description="Read-only summary for this student.">
      <dl className="space-y-4">
        <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
          <dt className="text-sm font-semibold text-slate-500">Student</dt>
          <dd className="text-base font-bold text-slate-900">{row.studentName}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
          <dt className="text-sm font-semibold text-slate-500">Class</dt>
          <dd className="text-base font-semibold text-slate-800">{row.classLabel}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
          <dt className="text-sm font-semibold text-slate-500">Total fees</dt>
          <dd className="tabular-nums text-base font-bold text-slate-900">{formatInr(row.totalFees)}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
          <dt className="text-sm font-semibold text-slate-500">Paid amount</dt>
          <dd className="tabular-nums text-base font-bold text-emerald-800">{formatInr(row.paidAmount)}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
          <dt className="text-sm font-semibold text-slate-500">Due amount</dt>
          <dd className="tabular-nums text-base font-bold text-rose-800">{formatInr(due)}</dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-sm font-semibold text-slate-500">Status</dt>
          <dd>
            <StatusBadge status={status} />
          </dd>
        </div>
      </dl>
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
