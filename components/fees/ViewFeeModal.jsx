"use client";

import Modal from "@/components/ui/Modal";
import { formatInr } from "@/lib/fees-data";

function StatusBadge({ status }) {
  const paid = status === "paid";
  const label = paid ? "Paid" : "Pending";
  const map = paid
    ? "border-emerald-300/90 bg-emerald-100 text-emerald-900 ring-emerald-200"
    : "border-rose-300/90 bg-rose-100 text-rose-900 ring-rose-200";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${map}`}>{label}</span>
  );
}

function SourceBadge({ feeSource }) {
  const auto = feeSource === "class_assignment";
  const label = auto ? "Auto (class tuition)" : "Manual entry";
  const map = auto ? "border-sky-300/90 bg-sky-50 text-sky-950 ring-sky-200" : "border-slate-300/90 bg-slate-100 text-slate-800 ring-slate-200";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${map}`}>{label}</span>
  );
}

function formatLongDate(iso) {
  if (!iso) return "—";
  try {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

export default function ViewFeeModal({ open, onClose, row }) {
  if (!row) return null;

  return (
    <Modal open={open} onClose={onClose} title="Fee details" description="Payment record linked to the student.">
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
          <dt className="text-sm font-semibold text-slate-500">Amount</dt>
          <dd className="tabular-nums text-base font-bold text-slate-900">{formatInr(row.amount)}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
          <dt className="text-sm font-semibold text-slate-500">Date</dt>
          <dd className="text-base font-semibold text-slate-800">{formatLongDate(row.paymentDate)}</dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <dt className="text-sm font-semibold text-slate-500">Source</dt>
          <dd>
            <SourceBadge feeSource={row.feeSource} />
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="text-sm font-semibold text-slate-500">Status</dt>
          <dd>
            <StatusBadge status={row.status} />
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
