/**
 * Canonical tuition schedule (matches `class_fees` seed SQL).
 * Nursery / LKG / UKG fixed; Class 1–12: UKG + 500 × class number.
 */

export function computeScheduledFeeAmount(className) {
  const key = String(className ?? "").trim();
  if (!key) return null;
  if (key === "Nursery") return 2000;
  if (key === "LKG") return 2500;
  if (key === "UKG") return 3000;
  const n = Number.parseInt(key, 10);
  if (!Number.isFinite(n) || n < 1 || n > 12) return null;
  return 3000 + n * 500;
}

/** Keys inserted into `class_fees.class_name` — keep in sync with CLASS_OPTIONS in students-data */
export const SCHEDULE_CLASS_NAMES = [
  "Nursery",
  "LKG",
  "UKG",
  ...Array.from({ length: 12 }, (_, i) => String(i + 1)),
];
