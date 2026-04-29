"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  CLASS_OPTIONS,
  DOB_DAY_OPTIONS,
  DOB_MONTH_OPTIONS,
  formatStudentDobForDb,
  GENDER_OPTIONS,
  getAdmissionYearOptions,
  getDobYearOptions,
  isValidDobParts,
  SECTION_OPTIONS,
} from "@/lib/students-data";
import { formatInr } from "@/lib/fees-data";
import StudentAvatar from "@/components/students/StudentAvatar";
import { STUDENT_PROFILE_IMAGE_ACCEPT, validateProfileImageFile } from "@/lib/student-profile-image";
import { ddmmFromIsoDate, formatStudentRegistryId, namePrefix3 } from "@/lib/student-id";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-base font-medium text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-[#1d4ed8]/40 focus:bg-white focus:ring-4 focus:ring-[#1d4ed8]/12";

const labelClass = "block text-sm font-semibold text-slate-700 sm:text-[15px]";

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
    req("section", "Select section");
    req("rollNo", "Enter roll number");
    req("dob_day", "Select day");
    req("dob_month", "Select month");
    req("dob_year", "Select year");
    if (
      values.dob_day &&
      values.dob_month &&
      values.dob_year &&
      !isValidDobParts(values.dob_year, values.dob_month, values.dob_day)
    ) {
      missing.push({ id: pid("dob_day"), msg: "Choose a valid date" });
    }
  }

  return missing;
}

function fmtAdmissionSummary(iso) {
  if (!iso || typeof iso !== "string" || !iso.trim()) return null;
  try {
    const d = parseISO(iso.trim().slice(0, 10));
    if (Number.isNaN(d.getTime())) return null;
    return format(d, "MMMM d, yyyy");
  } catch {
    return null;
  }
}

/** Admission date via Day / Month / Year — keeps admission_* parts in form state so saves never lose the selection. */
function AdmissionDateSelectors({ values, onAdmissionPartsChange, pid }) {
  const admissionYears = useMemo(() => getAdmissionYearOptions(), []);
  const day = String(values.admission_day ?? "").trim();
  const mo = String(values.admission_month ?? "").trim();
  const yr = String(values.admission_year ?? "").trim();

  function setAdmissionPart(field, val) {
    const nextDay = field === "admission_day" ? val : day;
    const nextMo = field === "admission_month" ? val : mo;
    const nextY = field === "admission_year" ? val : yr;
    const iso = formatStudentDobForDb({
      dob_day: nextDay,
      dob_month: nextMo,
      dob_year: nextY,
    });
    onAdmissionPartsChange({
      admission_day: nextDay,
      admission_month: nextMo,
      admission_year: nextY,
      admissionDate: iso,
    });
  }

  const summary = fmtAdmissionSummary(values.admissionDate);

  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <span className={labelClass} id={pid("admission-legend")}>
        Admission date
      </span>
      <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-3" role="group" aria-labelledby={pid("admission-legend")}>
        <div className="min-w-0">
          <label htmlFor={pid("adm_day")} className="sr-only">
            Day
          </label>
          <select
            id={pid("adm_day")}
            value={day}
            onChange={(e) => setAdmissionPart("admission_day", e.target.value)}
            className={inputClass}
          >
            <option value="">Day</option>
            {DOB_DAY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={pid("adm_month")} className="sr-only">
            Month
          </label>
          <select
            id={pid("adm_month")}
            value={mo}
            onChange={(e) => setAdmissionPart("admission_month", e.target.value)}
            className={inputClass}
          >
            <option value="">Month</option>
            {DOB_MONTH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor={pid("adm_year")} className="sr-only">
            Year
          </label>
          <select
            id={pid("adm_year")}
            value={yr}
            onChange={(e) => setAdmissionPart("admission_year", e.target.value)}
            className={inputClass}
          >
            <option value="">Year</option>
            {admissionYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className={`text-sm font-medium ${summary ? "text-slate-600" : "text-slate-500"}`} aria-live="polite">
        {summary ? <>Selected: {summary}</> : <>Pick day, month, and year (optional).</>}
      </p>
    </div>
  );
}

export default function StudentForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save student",
  idPrefix = "sf",
  isEditing = false,
  modalOpen = false,
  classFeePreview = null,
  submitError = null,
  onAvatarFilePendingChange,
  onAdmissionPartsChange,
}) {
  const pid = (name) => `${idPrefix}-${name}`;
  const avatarInputRef = useRef(null);
  const [avatarBlobUrl, setAvatarBlobUrl] = useState(null);
  const [avatarFieldError, setAvatarFieldError] = useState("");

  useEffect(() => {
    if (!modalOpen) return;
    setAvatarFieldError("");
    setAvatarBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onAvatarFilePendingChange?.(null);
  }, [modalOpen]);

  function handleAvatarInputChange(e) {
    const file = e.target.files?.[0];
    const input = e.target;
    if (input) input.value = "";
    if (!file) return;
    const err = validateProfileImageFile(file);
    if (err) {
      setAvatarFieldError(err);
      return;
    }
    setAvatarFieldError("");
    setAvatarBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onAvatarFilePendingChange?.(file);
  }

  function handleAvatarRemove() {
    setAvatarFieldError("");
    setAvatarBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onAvatarFilePendingChange?.(null);
    onChange({ target: { name: "profileImage", value: "" } });
  }

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
  const dobYearOptions = useMemo(() => getDobYearOptions(), []);

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

  async function runSave() {
    const missing = validateStep(1, values, pid);
    if (missing.length) {
      setShowStepErrors(true);
      goToStep(1);
      document.getElementById(missing[0].id)?.focus?.({ preventScroll: true });
      return;
    }
    await Promise.resolve(onSubmit());
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <nav aria-label="Progress" className="mb-3 shrink-0 rounded-xl border border-slate-100 bg-slate-50/80 px-2 py-2 sm:px-3">
        <ol className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
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

      {submitError ? (
        <div
          className="mb-3 shrink-0 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-950"
          role="alert"
        >
          {submitError}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pb-6 [-webkit-overflow-scrolling:touch]">
        <div key={`${step}-${panelKey}`} className="animate-erp-step rounded-xl border border-slate-100 bg-white px-2 py-2 sm:px-3">

        {step === 1 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3">
            <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-4">
              <span className={labelClass}>Profile photo</span>
              <p className="mt-1 text-xs font-medium text-slate-500">Optional · JPG or PNG · Max 2 MB</p>
              <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <StudentAvatar name={values.name} imageUrl={avatarBlobUrl || values.profileImage || null} size="form" />
                <div className="flex min-w-0 flex-col gap-2">
                  <input
                    ref={avatarInputRef}
                    id={pid("profileImage-file")}
                    type="file"
                    accept={STUDENT_PROFILE_IMAGE_ACCEPT.inputAccept}
                    className="sr-only"
                    tabIndex={-1}
                    onChange={handleAvatarInputChange}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="rounded-xl border border-[#1d4ed8]/35 bg-white px-4 py-2 text-sm font-bold text-[#1d4ed8] shadow-sm transition hover:bg-[#1d4ed8]/5"
                    >
                      {avatarBlobUrl || values.profileImage?.trim() ? "Change photo" : "Upload photo"}
                    </button>
                    {(avatarBlobUrl || values.profileImage?.trim()) && (
                      <button
                        type="button"
                        onClick={handleAvatarRemove}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                  {avatarFieldError ? (
                    <p className="text-sm font-medium text-rose-700" role="alert">
                      {avatarFieldError}
                    </p>
                  ) : null}
                  <p className="text-xs font-medium text-slate-500">Preview updates before you save. Photo uploads when you submit.</p>
                </div>
              </div>
            </div>
            {values.studentId?.trim() ? (
              <div className="sm:col-span-2">
                <label htmlFor={pid("studentId-display")} className={labelClass}>
                  Student ID
                </label>
                <input
                  id={pid("studentId-display")}
                  readOnly
                  tabIndex={-1}
                  value={values.studentId}
                  className={`${inputClass} cursor-default bg-slate-100/90 font-mono text-[15px] tracking-wide text-slate-800`}
                  aria-describedby={pid("student-id-help")}
                />
                <p id={pid("student-id-help")} className="mt-1 text-xs font-medium text-slate-500">
                  Assigned automatically when this student was added — it cannot be edited here.
                </p>
              </div>
            ) : isEditing ? (
              <p className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
                No student ID on file for this record.
              </p>
            ) : (
              String(values.name ?? "")
                .trim()
                .length >= 1 && (
                <div className="sm:col-span-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-3 py-2.5 text-sm text-slate-700">
                  <span className="font-semibold text-slate-800">ID preview</span>{" "}
                  <span className="font-mono tracking-wide text-slate-900">
                    {formatStudentRegistryId(
                      namePrefix3(values.name),
                      ddmmFromIsoDate(formatStudentDobForDb(values) || ""),
                      1,
                    )}
                  </span>
                  <span className="text-slate-500"> — sequence (01, 02, …) is assigned automatically when you save.</span>
                </div>
              )
            )}
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
              <select id={pid("section")} name="section" required value={values.section} onChange={onChange} className={inputClass}>
                <option value="">Select section</option>
                {SECTION_OPTIONS.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={pid("rollNo")} className={labelClass}>
                Roll number
              </label>
              <input id={pid("rollNo")} name="rollNo" type="text" required value={values.rollNo} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor={pid("tuition")} className={labelClass}>
                Tuition (annual, ₹)
              </label>
              <input
                id={pid("tuition")}
                name="tuition"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Filled automatically when you pick class"
                value={values.tuition}
                onChange={onChange}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <span className={labelClass} id={pid("dob-fieldset-label")}>
                  Date of birth
                </span>
                <div
                  className="mt-1 grid grid-cols-3 gap-2"
                  role="group"
                  aria-labelledby={pid("dob-fieldset-label")}
                >
                  <div className="min-w-0">
                    <label htmlFor={pid("dob_day")} className="sr-only">
                      Day
                    </label>
                    <select
                      id={pid("dob_day")}
                      name="dob_day"
                      required
                      value={values.dob_day}
                      onChange={onChange}
                      className={inputClass}
                    >
                      <option value="">Day</option>
                      {DOB_DAY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor={pid("dob_month")} className="sr-only">
                      Month
                    </label>
                    <select
                      id={pid("dob_month")}
                      name="dob_month"
                      required
                      value={values.dob_month}
                      onChange={onChange}
                      className={inputClass}
                    >
                      <option value="">Month</option>
                      {DOB_MONTH_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor={pid("dob_year")} className="sr-only">
                      Year
                    </label>
                    <select
                      id={pid("dob_year")}
                      name="dob_year"
                      required
                      value={values.dob_year}
                      onChange={onChange}
                      className={inputClass}
                    >
                      <option value="">Year</option>
                      {dobYearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="min-w-0">
                <label htmlFor={pid("gender")} className={labelClass}>
                  Gender
                </label>
                <select id={pid("gender")} name="gender" value={values.gender} onChange={onChange} className={inputClass}>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value === "" ? "placeholder" : g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {classFeePreview && values.classGrade?.trim() && (
              <div className="sm:col-span-2 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2.5 text-sm">
                <p className="font-bold text-slate-800">Tuition (catalog)</p>
                {classFeePreview.warning ? (
                  <p className="font-medium text-amber-900">{classFeePreview.warning}</p>
                ) : classFeePreview.catalogAmount != null ? (
                  <p className="font-semibold text-slate-800">
                    Assigned annual tuition: <span className="tabular-nums text-[#1d4ed8]">{formatInr(classFeePreview.catalogAmount)}</span>
                    <span className="block pt-1 text-xs font-normal text-slate-500">
                      Tuition updates when you change class. A pending fee row may be created in Fees when you save.
                    </span>
                  </p>
                ) : null}
                {classFeePreview.assigned ? (
                  <p className="text-xs font-medium text-slate-600">
                    Current saved assignment: {formatInr(classFeePreview.assigned.amount)} ·{" "}
                    <span className={classFeePreview.assigned.status === "paid" ? "text-emerald-800" : "text-rose-800"}>
                      {classFeePreview.assigned.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            <fieldset className="rounded-xl border border-slate-100 bg-slate-50/40 px-3 py-2.5">
              <legend className="px-1 text-xs font-bold uppercase tracking-wide text-slate-600">Father</legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label htmlFor={pid("father_name")} className={labelClass}>
                    Name
                  </label>
                  <input id={pid("father_name")} name="father_name" type="text" value={values.father_name} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("father_phone")} className={labelClass}>
                    Phone
                  </label>
                  <input id={pid("father_phone")} name="father_phone" type="tel" value={values.father_phone} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("father_occupation")} className={labelClass}>
                    Occupation
                  </label>
                  <input id={pid("father_occupation")} name="father_occupation" type="text" value={values.father_occupation} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("father_qualification")} className={labelClass}>
                    Qualification
                  </label>
                  <input id={pid("father_qualification")} name="father_qualification" type="text" value={values.father_qualification} onChange={onChange} className={inputClass} />
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-slate-100 bg-slate-50/40 px-3 py-2.5">
              <legend className="px-1 text-xs font-bold uppercase tracking-wide text-slate-600">Mother</legend>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label htmlFor={pid("mother_name")} className={labelClass}>
                    Name
                  </label>
                  <input id={pid("mother_name")} name="mother_name" type="text" value={values.mother_name} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("mother_phone")} className={labelClass}>
                    Phone
                  </label>
                  <input id={pid("mother_phone")} name="mother_phone" type="tel" value={values.mother_phone} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("mother_occupation")} className={labelClass}>
                    Occupation
                  </label>
                  <input id={pid("mother_occupation")} name="mother_occupation" type="text" value={values.mother_occupation} onChange={onChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={pid("mother_qualification")} className={labelClass}>
                    Qualification
                  </label>
                  <input id={pid("mother_qualification")} name="mother_qualification" type="text" value={values.mother_qualification} onChange={onChange} className={inputClass} />
                </div>
              </div>
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3">
            <div className="sm:col-span-2">
              <label htmlFor={pid("address")} className={labelClass}>
                Address
              </label>
              <textarea id={pid("address")} name="address" rows={3} value={values.address} onChange={onChange} className={`${inputClass} resize-y min-h-[96px]`} />
            </div>
            <div>
              <label htmlFor={pid("city")} className={labelClass}>
                City
              </label>
              <input id={pid("city")} name="city" type="text" value={values.city} onChange={onChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor={pid("state")} className={labelClass}>
                State
              </label>
              <input id={pid("state")} name="state" type="text" value={values.state} onChange={onChange} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={pid("famousLandmark")} className={labelClass}>
                Famous Landmark
              </label>
              <input
                id={pid("famousLandmark")}
                name="famousLandmark"
                type="text"
                placeholder="Enter nearby famous place"
                value={values.famousLandmark}
                onChange={onChange}
                autoComplete="off"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={pid("zipCode")} className={labelClass}>
                ZIP code
              </label>
              <input id={pid("zipCode")} name="zipCode" type="text" value={values.zipCode} onChange={onChange} className={inputClass} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3">
            <AdmissionDateSelectors values={values} onAdmissionPartsChange={onAdmissionPartsChange} pid={pid} />
            <div className="sm:col-span-2">
              <label htmlFor={pid("previousSchool")} className={labelClass}>
                Previous school
              </label>
              <input id={pid("previousSchool")} name="previousSchool" type="text" value={values.previousSchool} onChange={onChange} className={inputClass} placeholder='e.g. "Springfield Elementary" or None' />
            </div>
          </div>
        )}
      </div>

      {showStepErrors && missingForStep.length > 0 && (
        <p className="mt-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="status">
          Please complete the highlighted fields on this step.
        </p>
      )}
      </div>

      <div className="sticky bottom-0 z-10 mt-auto flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_28px_-14px_rgba(15,23,42,0.12)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <div className="flex flex-wrap gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={submitting}
              className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={() => void runSave()}
              className="rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1d4ed8]/25 hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving…" : submitLabel}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
