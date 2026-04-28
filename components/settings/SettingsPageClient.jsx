"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";

const inputLight =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-[15px] font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563eb]/45 focus:bg-white focus:ring-4 focus:ring-[#2563eb]/12";

const inputDark =
  "mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-4 py-3 text-[15px] font-medium text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/15";

const labelLight = "block text-sm font-semibold text-slate-700";
const labelDark = "block text-sm font-semibold text-slate-300";

export default function SettingsPageClient() {
  const fileRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    schoolName: "E-Skool Academy",
    contactEmail: "office@eskool.edu",
    phone: "+91 98765 43210",
    logoName: "",
  });

  const [profile, setProfile] = useState({
    name: "Kate Rivera",
    email: "kate.rivera@eskool.edu",
  });

  const [passwords, setPasswords] = useState({
    newPass: "",
    confirmPass: "",
  });

  const dark = theme === "dark";
  const inputClass = dark ? inputDark : inputLight;
  const labelClass = dark ? labelDark : labelLight;

  function handleLogoChange(e) {
    const f = e.target.files?.[0];
    setGeneral((g) => ({ ...g, logoName: f ? f.name : "" }));
  }

  function handleSave() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3200);
  }

  const cardSurface = dark
    ? "border border-slate-700/90 bg-slate-800/95 shadow-xl shadow-black/20 ring-slate-700/80"
    : "";

  return (
    <div className={`flex flex-col gap-10 transition-colors duration-300 ${dark ? "text-slate-100" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>Settings</h1>
          <p className={`mt-1 max-w-2xl text-base font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Manage school profile, your account, and appearance preferences (demo — changes stay in this session only).
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-[#2563eb] to-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/35 active:translate-y-0"
        >
          Save changes
        </button>
      </div>

      {saved ? (
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-100"
          role="status"
        >
          Settings saved successfully. (Demo — no data was sent to a server.)
        </div>
      ) : null}

      {/* General */}
      <Card className={`p-6 sm:p-8 ${cardSurface}`}>
        <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>General settings</h2>
        <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>School identity and contact details shown across the portal.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="school-name" className={labelClass}>
              School name
            </label>
            <input
              id="school-name"
              value={general.schoolName}
              onChange={(e) => setGeneral((g) => ({ ...g, schoolName: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <span className={labelClass}>School logo</span>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleLogoChange} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`rounded-xl border px-5 py-3 text-sm font-bold transition ${
                  dark
                    ? "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
                }`}
              >
                Upload image
              </button>
              <span className={`text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {general.logoName ? general.logoName : "PNG or JPG · max 2MB (demo)"}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Contact email
            </label>
            <input
              id="contact-email"
              type="email"
              value={general.contactEmail}
              onChange={(e) => setGeneral((g) => ({ ...g, contactEmail: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              value={general.phone}
              onChange={(e) => setGeneral((g) => ({ ...g, phone: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      {/* User */}
      <Card className={`p-6 sm:p-8 ${cardSurface}`}>
        <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>User settings</h2>
        <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>Profile details and password update (UI only — never sends credentials).</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className={labelClass}>
              Display name
            </label>
            <input
              id="profile-name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="profile-email" className={labelClass}>
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="new-pass" className={labelClass}>
              New password
            </label>
            <input
              id="new-pass"
              type="password"
              autoComplete="new-password"
              value={passwords.newPass}
              onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
              placeholder="Leave blank to keep current"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm-pass" className={labelClass}>
              Confirm new password
            </label>
            <input
              id="confirm-pass"
              type="password"
              autoComplete="new-password"
              value={passwords.confirmPass}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmPass: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      {/* Theme */}
      <Card className={`p-6 sm:p-8 ${cardSurface}`}>
        <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>Theme</h2>
        <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>
          Preview light or dark styling on this settings screen (demo — does not persist across reloads).
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className={`text-sm font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>Appearance</span>
          <div
            className={`inline-flex rounded-xl border p-1 shadow-inner ${dark ? "border-slate-600 bg-slate-900" : "border-slate-200 bg-slate-50"}`}
            role="group"
            aria-label="Theme"
          >
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                !dark ? "bg-white text-[#2563eb] shadow-sm ring-1 ring-slate-200/90" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                dark ? "bg-slate-700 text-white shadow-sm ring-1 ring-slate-500/80" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
