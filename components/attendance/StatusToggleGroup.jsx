"use client";

const OPTIONS = [
  {
    key: "present",
    label: "Present",
    selectedClass:
      "border-emerald-400 bg-emerald-500/15 text-emerald-900 ring-2 ring-emerald-400/70 shadow-[0_0_0_3px_rgb(16,185,129,0.15)]",
  },
  {
    key: "absent",
    label: "Absent",
    selectedClass:
      "border-rose-400 bg-rose-500/15 text-rose-900 ring-2 ring-rose-400/70 shadow-[0_0_0_3px_rgb(244,63,94,0.12)]",
  },
];

export default function StatusToggleGroup({ value, onChange, namePrefix }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Attendance status">
      {OPTIONS.map((opt) => {
        const selected = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={selected}
            name={`${namePrefix}-${opt.key}`}
            onClick={() => onChange(opt.key)}
            className={`rounded-xl border px-4 py-2 text-sm font-bold transition duration-200 sm:min-w-[5.5rem] ${
              selected ? opt.selectedClass : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
