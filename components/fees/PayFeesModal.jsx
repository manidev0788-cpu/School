"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import { classDisplayName } from "@/lib/classes-data";

function todayIsoLocal() {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}

/**
 * Create or edit a fee row: amount, status (paid | pending), payment date.
 * New entries require a student selection.
 */
export default function PayFeesModal({ open, onClose, students = [], feeToEdit = null, saving = false, onCommit }) {
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending");
  const [paymentDate, setPaymentDate] = useState(todayIsoLocal);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [students]);

  useEffect(() => {
    if (!open) return;
    if (feeToEdit) {
      setStudentId(feeToEdit.studentId ?? "");
      setAmount(String(feeToEdit.amount ?? ""));
      setStatus(feeToEdit.status === "paid" ? "paid" : "pending");
      setPaymentDate(feeToEdit.paymentDate || todayIsoLocal());
    } else {
      setStudentId(sortedStudents[0]?.id ?? "");
      setAmount("");
      setStatus("pending");
      setPaymentDate(todayIsoLocal());
    }
  }, [open, feeToEdit, sortedStudents]);

  if (!open) return null;

  const isEdit = Boolean(feeToEdit);

  function handleSubmit(e) {
    e.preventDefault();
    const num = Number.parseFloat(amount);
    if (Number.isNaN(num) || num < 0) return;
    if (!isEdit && !studentId) return;

    onCommit({
      feeId: feeToEdit?.id,
      studentId: isEdit ? feeToEdit.studentId : studentId,
      amount: num,
      status,
      paymentDate,
    });
  }

  const studentLabel = feeToEdit
    ? `${feeToEdit.studentName} · ${feeToEdit.classLabel}`
    : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit fee record" : "Record fee"}
      description={
        isEdit
          ? feeToEdit?.feeSource === "class_assignment"
            ? "This row was created automatically from class tuition. You can mark paid or adjust if needed."
            : "Update amount, status, or date for this entry."
          : "Optional manual fee entry — class tuition is assigned automatically when students are added."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {isEdit ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-sm font-semibold text-slate-800">
            {studentLabel}
          </div>
        ) : (
          <div>
            <label htmlFor="fee-student" className="block text-sm font-semibold text-slate-700">
              Student
            </label>
            <select
              id="fee-student"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
            >
              <option value="">Select student</option>
              {sortedStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {classDisplayName({ grade: s.classGrade, section: s.section })}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="fee-amount" className="block text-sm font-semibold text-slate-700">
            Amount (₹)
          </label>
          <input
            id="fee-amount"
            type="number"
            min={0}
            step={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold tabular-nums text-slate-900 shadow-inner outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div>
          <label htmlFor="fee-status" className="block text-sm font-semibold text-slate-700">
            Status
          </label>
          <select
            id="fee-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1.5 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
          >
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label htmlFor="fee-date" className="block text-sm font-semibold text-slate-700">
            Date
          </label>
          <input
            id="fee-date"
            type="date"
            required
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-800 outline-none focus:border-[#1d4ed8]/40 focus:ring-4 focus:ring-[#1d4ed8]/12"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || (!isEdit && sortedStudents.length === 0)}
            className="rounded-full bg-linear-to-r from-[#1d4ed8] to-sky-600 px-8 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Save fee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
