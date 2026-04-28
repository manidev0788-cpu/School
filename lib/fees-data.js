/** Static dummy data — Fees Management UI */

export const FEES_CLASS_OPTIONS = [
  { value: "all", label: "All classes" },
  { value: "Class 1A", label: "Class 1A" },
  { value: "Class 1B", label: "Class 1B" },
  { value: "Class 2A", label: "Class 2A" },
  { value: "Class 2B", label: "Class 2B" },
  { value: "Class 3A", label: "Class 3A" },
];

export const FEES_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "partial", label: "Partial" },
];

export const PAYMENT_METHOD_OPTIONS = ["Cash", "UPI", "Card", "Bank transfer", "Cheque"];

/** Starter ledger rows — UI state may update paid amounts in memory. */
export const INITIAL_FEE_ROWS = [
  {
    id: "fee-1",
    studentName: "Riya Kapoor",
    classLabel: "Class 1A",
    totalFees: 48000,
    paidAmount: 48000,
  },
  {
    id: "fee-2",
    studentName: "Vihaan Singh",
    classLabel: "Class 1A",
    totalFees: 48000,
    paidAmount: 24000,
  },
  {
    id: "fee-3",
    studentName: "Neha Verma",
    classLabel: "Class 1B",
    totalFees: 52000,
    paidAmount: 0,
  },
  {
    id: "fee-4",
    studentName: "Meera Nambiar",
    classLabel: "Class 2A",
    totalFees: 56000,
    paidAmount: 56000,
  },
  {
    id: "fee-5",
    studentName: "Dhruv Khanna",
    classLabel: "Class 2A",
    totalFees: 56000,
    paidAmount: 28000,
  },
  {
    id: "fee-6",
    studentName: "Kiara Joshi",
    classLabel: "Class 2B",
    totalFees: 54000,
    paidAmount: 0,
  },
  {
    id: "fee-7",
    studentName: "Viraj Anand",
    classLabel: "Class 3A",
    totalFees: 60000,
    paidAmount: 60000,
  },
  {
    id: "fee-8",
    studentName: "Myra Saxena",
    classLabel: "Class 3A",
    totalFees: 60000,
    paidAmount: 45000,
  },
];

export function feeDue(row) {
  return Math.max(0, row.totalFees - row.paidAmount);
}

export function feeStatus(row) {
  const due = feeDue(row);
  if (row.paidAmount <= 0) return "unpaid";
  if (due <= 0) return "paid";
  return "partial";
}

export function formatInr(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
