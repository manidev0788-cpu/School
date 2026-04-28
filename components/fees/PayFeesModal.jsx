"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { feeDue, formatInr, PAYMENT_METHOD_OPTIONS } from "@/lib/fees-data";

function todayIsoLocal() {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}

export default function PayFeesModal({ open, onClose, row, onSubmitPayment }) {
  const due = row ? feeDue(row) : 0;
  const [amount, setAmount] = useState("");
  const [payDate, setPayDate] = useState(todayIsoLocal);
  const [method, setMethod] = useState("");

  useEffect(() => {
    if (!open || !row) return;
    setAmount(due > 0 ? String(due) : "");
    setPayDate(todayIsoLocal());
    setMethod("");
  }, [open, row, due]);

  if (!row) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const num = Number.parseFloat(amount);
    if (Number.isNaN(num) || num <= 0) return;
    const capped = Math.min(num, due);
    onSubmitPayment(row.id, capped, payDate, method || undefined);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record payment"
      description={`${row.studentName} · ${row.classLabel}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-sm">
          <p className="font-semibold text-slate-700">
            Due now: <span className="tabular-nums text-slate-900">{formatInr(due)}</span>
          </p>
          <p className="mt-1 text-slate-500">Payment cannot exceed the outstanding due.</p>
        </div>

        <div>
          <label htmlFor="pay-amount" className="block text-sm font-semibold text-slate-700">
            Amount (₹)
          </label>
          <input
            id="pay-amount"
            type="number"
            min={1}
            max={due}
            step={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold tabular-nums text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div>
          <label htmlFor="pay-date" className="block text-sm font-semibold text-slate-700">
            Payment date
          </label>
          <input
            id="pay-date"
            type="date"
            required
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-800 outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div>
          <label htmlFor="pay-method" className="block text-sm font-semibold text-slate-700">
            Payment method <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <select
            id="pay-method"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
          >
            <option value="">Select method</option>
            {PAYMENT_METHOD_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Confirm payment
          </button>
        </div>
      </form>
    </Modal>
  );
}
