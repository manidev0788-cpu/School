"use client";

import { useEffect, useMemo, useState } from "react";
import { CLASS_OPTIONS, GENDER_OPTIONS } from "@/lib/students-data";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-base font-medium text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-[#1d4ed8]/40 focus:bg-white focus:ring-4 focus:ring-[#1d4ed8]/12";

const labelClass = "block text-sm font-semibold text-slate-700";

const STEPS = [
  { id: 1, label: "Basic", short: "Basic info" },
  { id: 2, label: "Parents", short: "Parent details" },
  { id: 3, label: "Address", short: "Address" },
  { id: 4, label: "Academic", short: "Academic info" },
];

function validateStep(step, values, pid) {
  const missing = [];
  const req = (name, msg) => {
    const v = values[name];
    if (v === undefined || v === null || String(v).trim() === "") missing.push({ id: pid(name), msg });
  };

  if (step === 1) {
    req("name", "Enter full name");
    req("classGrade", "Select class");
    req("section", "Enter section");
    req("rollNo", "Enter roll number");
    req("dateOfBirth", "Pick date of birth");
    req("gender", "Select gender");
  }
  if (step === 2) {
    req("fatherName", "Enter father's name");
    req("fatherPhone", "Enter father's phone");
    req("fatherOccupation", "Enter father's occupation");
    req("fatherQualification", "Enter father's qualification");
    req("motherName", "Enter mother's name");
    req("motherPhone", "Enter mother's phone");
    req("motherOccupation", "Enter mother's occupation");
    req("motherQualification", "Enter mother's qualification");
  }
  if (step === 3) {
    req("address", "Enter address");
    req("city", "Enter city");
    req("state", "Enter state");
    req("zipCode", "Enter ZIP code");
  }
  if (step === 4) {
    req("admissionDate", "Pick admission date");
    req("previousSchool", "Enter previous school or \"None\"");
  }

  return missing;
}

export default function StudentForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Save student",
  idPrefix = "sf",
  modalOpen = false,
}) {
  const pid = (name) => `${idPrefix}-${name}`;
  const [step, setStep] = useState(1);
  const [panelKey, setPanelKey] = useState(0);
  const [showStepErrors, setShowStepErrors] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      setStep(1);
      setShowStepErrors(false);
    }
  }, [modalOpen]);

  useEffect(() => {
    setShowStepErrors(false);
  }, [step]);

  const totalSteps = STEPS.length;

  const missingForStep = useMemo(() => validateStep(step, values, pid), [step, values, pid]);

  const goToStep = (next) => {
    if (next === step) return;
    setStep(next);
    setPanelKey((k) => k + 1);
  };

  const handleNext = () => {
    const missing = validateStep(step, values, pid);
    if (missing.length) {
      setShowStepErrors(true);
      document.getElementById(missing[0].id)?.focus?.({ preventScroll: true });
      return;
    }
    goToStep(Math.min(totalSteps, step + 1));
  };

  const handleBack = () => goToStep(Math.max(1, step - 1));

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const missing = validateStep(4, values, pid);
    if (missing.length) {
      setShowStepErrors(true);
      goToStep(4);
      document.getElementById(missing[0].id)?.focus?.({ preventScroll: true });
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5">
      <nav aria-label="Progress" className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3">
        <ol className="flex flex-wrap items-center justify-between gap-2">
          {STEPS.map((s, idx) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToStep(s.id)}
                  className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left transition ${
                    active
                      ? "bg-white shadow-sm ring-1 ring-[#1d4ed8]/25"
                      : done
                        ? "bg-white/70 hover:bg-white"
                        : "opacity-80 hover:bg-white/60"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active
                        ? "bg-[#1d4ed8] text-white"
                        : done
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {done ? "✓" : s.id}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-xs font-semibold ${active ? "text-[#1d4ed8]" : "text-slate-900"}`}>
                      {s.label}
                    </span>
                    <span className="block truncate text-[11px] text-slate-500">{s.short}</span>
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <span className="hidden h-px w-6 shrink-0 bg-slate-200 sm:block" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div key={`${step}-${panelKey}`} className="animate-erp-step rounded-2xl border border-slate-100 bg-white px-1 py-2 sm:px-2">

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={pid("name")} className={labelClass}>
                Full name
              </label>
              <input
                id={pid("name")}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={onChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor={pid("classGrade")} className={labelClass}>
                Class
              </label>
              <select id={pid("classGrade")} name="classGrade" required value={values.classGrade} onChange={onChange} className={inputClass}>
                <option value="">Select class</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={pid("section")} className={labelClass}>
                Section
              </label>
              <input id={pid("section")} name="section" type="text" required value={values.section} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor={pid("rollNo")} className={labelClass}>
                Roll number
              </label>
              <input id={pid("rollNo")} name="rollNo" type="text" required value={values.rollNo} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor={pid("dateOfBirth")} className={labelClass}>
                Date of birth
              </label>
              <input id={pid("dateOfBirth")} name="dateOfBirth" type="date" required value={values.dateOfBirth} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor={pid("gender")} className={labelClass}>
                Gender
              </label>
              <select id={pid("gender")} name="gender" required value={values.gender} onChange={onChange} className={inputClass}>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value === "" ? "placeholder" : g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <fieldset className="rounded-2xl border border-slate-100 bg-slate-50/40 px-3 py-3">
              <legend className="px-1 text-xs font-bold uppercase tracking-wide text-slate-600">Father</legend>
              <div className="grid gap-3">
                <div>
                  <label htmlFor={pid("fatherName")} className={labelClass}>
                    Name
                  </label>
                  <input id={pid("fatherName")} name="fatherName" type="text" required value={values.fatherName} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("fatherPhone")} className={labelClass}>
                    Phone
                  </label>
                  <input id={pid("fatherPhone")} name="fatherPhone" type="tel" required value={values.fatherPhone} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("fatherOccupation")} className={labelClass}>
                    Occupation
                  </label>
                  <input id={pid("fatherOccupation")} name="fatherOccupation" type="text" required value={values.fatherOccupation} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("fatherQualification")} className={labelClass}>
                    Qualification
                  </label>
                  <input id={pid("fatherQualification")} name="fatherQualification" type="text" required value={values.fatherQualification} onChange={onChange} className={inputClass} />
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-2xl border border-slate-100 bg-slate-50/40 px-3 py-3">
              <legend className="px-1 text-xs font-bold uppercase tracking-wide text-slate-600">Mother</legend>
              <div className="grid gap-3">
                <div>
                  <label htmlFor={pid("motherName")} className={labelClass}>
                    Name
                  </label>
                  <input id={pid("motherName")} name="motherName" type="text" required value={values.motherName} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("motherPhone")} className={labelClass}>
                    Phone
                  </label>
                  <input id={pid("motherPhone")} name="motherPhone" type="tel" required value={values.motherPhone} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("motherOccupation")} className={labelClass}>
                    Occupation
                  </label>
                  <input id={pid("motherOccupation")} name="motherOccupation" type="text" required value={values.motherOccupation} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("motherQualification")} className={labelClass}>
                    Qualification
                  </label>
                  <input id={pid("motherQualification")} name="motherQualification" type="text" required value={values.motherQualification} onChange={onChange} className={inputClass} />
                </div>
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={pid("address")} className={labelClass}>
                Address
              </label>
              <textarea id={pid("address")} name="address" rows={4} required value={values.address} onChange={onChange} className={`${inputClass} resize-y min-h-[110px]`} />
            </div>
            <div>
              <label htmlFor={pid("city")} className={labelClass}>
                City
              </label>
              <input id={pid("city")} name="city" type="text" required value={values.city} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor={pid("state")} className={labelClass}>
                State
              </label>
              <input id={pid("state")} name="state" type="text" required value={values.state} onChange={onChange} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={pid("zipCode")} className={labelClass}>
                ZIP code
              </label>
              <input id={pid("zipCode")} name="zipCode" type="text" required value={values.zipCode} onChange={onChange} className={inputClass} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={pid("admissionDate")} className={labelClass}>
                Admission date
              </label>
              <input id={pid("admissionDate")} name="admissionDate" type="date" required value={values.admissionDate} onChange={onChange} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={pid("previousSchool")} className={labelClass}>
                Previous school
              </label>
              <input id={pid("previousSchool")} name="previousSchool" type="text" required value={values.previousSchool} onChange={onChange} className={inputClass} placeholder='e.g. "Springfield Elementary" or None' />
            </div>
          </div>
        )}
      </div>

      {showStepErrors && missingForStep.length > 0 && (
        <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="status">
          Please complete the highlighted fields on this step.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          Cancel
        </button>
        <div className="flex flex-wrap gap-2">
          {step > 1 && (
            <button type="button" onClick={handleBack} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" onClick={handleNext} className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af]">
              Next
            </button>
          ) : (
            <button type="submit" className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af]">
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
