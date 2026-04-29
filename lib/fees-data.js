/** Fees UI helpers — amounts formatted as INR */

export const FEES_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
];

export function formatInr(amount) {
  const n = typeof amount === "number" ? amount : Number.parseFloat(String(amount ?? 0));
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}
