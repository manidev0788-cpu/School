"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { FORM_CLASS_OPTIONS, FORM_SUBJECT_OPTIONS } from "@/lib/teachers-data";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-base font-medium text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-[#1d4ed8]/40 focus:bg-white focus:ring-4 focus:ring-[#1d4ed8]/12";

export default function TeacherModal({ open, onClose, mode, teacher, onSave }) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState(FORM_SUBJECT_OPTIONS[0]?.value ?? "");
  const [assignedClass, setAssignedClass] = useState(FORM_CLASS_OPTIONS[0]?.value ?? "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && teacher) {
      setName(teacher.name);
      setSubject(teacher.subject);
      setAssignedClass(teacher.assignedClass);
      setPhone(teacher.phone);
      setEmail(teacher.email);
    } else if (mode === "add") {
      setName("");
      setSubject(FORM_SUBJECT_OPTIONS[0]?.value ?? "");
      setAssignedClass(FORM_CLASS_OPTIONS[0]?.value ?? "");
      setPhone("");
      setEmail("");
    }
  }, [open, mode, teacher]);

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      subject,
      assignedClass,
      phone: phone.trim(),
      email: email.trim(),
    };
    if (!payload.name || !payload.email) return;
    onSave(mode, mode === "edit" && teacher ? teacher.id : null, payload);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit teacher" : "Add teacher"}
      description={
        mode === "edit"
          ? "Update profile and assignment details."
          : "Register a faculty member and their teaching assignment."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="tm-name" className="block text-sm font-semibold text-slate-700">
            Full name
          </label>
          <input
            id="tm-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Menon"
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tm-subject" className="block text-sm font-semibold text-slate-700">
              Subject
            </label>
            <select
              id="tm-subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`${inputClass} cursor-pointer bg-white`}
            >
              {FORM_SUBJECT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tm-class" className="block text-sm font-semibold text-slate-700">
              Assigned class
            </label>
            <select
              id="tm-class"
              required
              value={assignedClass}
              onChange={(e) => setAssignedClass(e.target.value)}
              className={`${inputClass} cursor-pointer bg-white`}
            >
              {FORM_CLASS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tm-phone" className="block text-sm font-semibold text-slate-700">
            Phone
          </label>
          <input
            id="tm-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 …"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="tm-email" className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="tm-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@eskool.edu"
            className={inputClass}
          />
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
            {mode === "edit" ? "Save changes" : "Add teacher"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
