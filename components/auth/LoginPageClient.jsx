"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DEMO_USERS, ROLE_HOME } from "@/lib/auth-config";
import { setDemoSession } from "@/lib/auth-client";

/** High-quality classroom / collaborative learning */
const heroImage =
  "https://images.unsplash.com/photo-1509062522246-375579774feb?auto=format&fit=crop&w=1920&q=90";

/** Input styling — larger text; accent matches favicon blues */
const inputClass =
  "w-full rounded-xl border border-slate-200/90 bg-white/70 px-5 py-4 text-lg font-medium text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 placeholder:text-lg hover:border-[#93c5fd]/90 focus:border-[#2563eb] focus:bg-white focus:shadow-inner focus:shadow-[#2563eb]/15 focus:ring-4 focus:ring-[#2563eb]/18";

/** Same gradient stops as public/favicon.svg */
const brandGradient = "bg-linear-to-br from-[#38bdf8] via-[#2563eb] to-[#1e40af]";
const brandGradientBtn =
  "bg-linear-to-r from-[#38bdf8] via-[#2563eb] to-[#1e40af] hover:from-[#38bdf8] hover:via-[#2563eb] hover:to-[#1d4ed8]";

const features = [
  {
    label: "Easy management",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.85">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: "Real-time updates",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.85">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Secure system",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.85">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const demoAccounts = [
  { role: "Admin", email: "admin@demo.com", pass: "123456", badgeClass: "bg-indigo-500/15 text-indigo-700 ring-indigo-400/30" },
  { role: "Teacher", email: "teacher@demo.com", pass: "123456", badgeClass: "bg-sky-500/15 text-sky-800 ring-sky-400/35" },
  { role: "Parent", email: "parent@demo.com", pass: "123456", badgeClass: "bg-emerald-500/15 text-emerald-800 ring-emerald-400/35" },
];

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(fd.get("password") || "");

    const account = DEMO_USERS[email];
    if (!account || account.password !== password) {
      setError("Email or password is incorrect. Use the demo credentials below.");
      return;
    }

    setBusy(true);
    setDemoSession(account.role, email);
    const dest = ROLE_HOME[account.role] || "/dashboard";
    window.setTimeout(() => {
      router.replace(dest);
      router.refresh();
      setBusy(false);
    }, 320);
  }

  return (
    <div className="relative min-h-dvh overflow-hidden font-sans lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* —— Left: hero (50%) —— */}
      <div className="relative min-h-[48vh] lg:min-h-0">
        <Image
          src={heroImage}
          alt="Students collaborating and studying in a bright classroom"
          fill
          className="object-cover object-[center_35%] lg:object-center"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 bg-slate-950/35" aria-hidden />
        <div
          className="absolute inset-0 bg-linear-to-br from-[#0f172a]/88 via-[#1e1b4b]/82 to-[#312e81]/88"
          aria-hidden
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-[#1e3a8a]/25" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-1 flex min-h-[48vh] flex-col justify-center px-8 py-14 text-white lg:absolute lg:inset-0 lg:min-h-0 lg:justify-center lg:px-14 xl:px-16">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-100 ring-1 ring-white/25 backdrop-blur-md sm:text-sm">
            E-Skool ERP
          </div>

          <h1 className="mt-8 max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-[3.15rem] xl:leading-[1.06]">
            Smart School Management System
          </h1>

          <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-blue-50/95 sm:text-xl">
            Manage students, teachers, attendance, fees and results easily
          </p>

          <ul className="mt-12 flex max-w-lg flex-col gap-5">
            {features.map(({ label, icon }) => (
              <li
                key={label}
                className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/6 px-6 py-5 shadow-lg shadow-black/10 ring-1 ring-white/8 backdrop-blur-md transition duration-300 hover:border-white/25 hover:bg-white/12"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#38bdf8]/35 via-[#2563eb]/25 to-[#1e40af]/35 text-sky-100 ring-1 ring-white/25 transition group-hover:scale-[1.03] group-hover:text-white">
                  {icon}
                </span>
                <span className="text-lg font-semibold tracking-wide text-white sm:text-xl">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* —— Right: login + ambient background (50%) —— */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-14 sm:px-10 lg:px-12 lg:py-10">
        {/* Depth: blurred shapes */}
        <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#2563eb]/25 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-1/4 h-96 w-96 rounded-full bg-[#38bdf8]/25 blur-[110px]" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[120%] -translate-x-1/2 bg-linear-to-b from-indigo-100/90 to-transparent blur-2xl" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 20% 80%, rgb(37 99 235 / 0.16), transparent), radial-gradient(ellipse 60% 45% at 90% 15%, rgb(56 189 248 / 0.14), transparent)",
          }}
          aria-hidden
        />

        <div className="relative z-1 w-full max-w-lg">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-9 shadow-[0_28px_80px_-20px_rgb(37,99,235,0.18)] ring-1 ring-slate-200/60 backdrop-blur-xl sm:p-11">
            <div className="text-center">
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${brandGradient} text-4xl font-extrabold tracking-tight text-white shadow-xl shadow-[#2563eb]/40 ring-4 ring-white`}
              >
                E
              </div>
              <h2 className="mt-7 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Welcome back</h2>
              <p className="mt-3 text-lg font-medium text-slate-500">Sign in to access your workspace</p>
            </div>

            {from && !error ? (
              <div className="mt-8 rounded-xl border border-amber-200/90 bg-amber-50/95 px-5 py-4 text-center text-base font-semibold text-amber-950 shadow-sm ring-1 ring-amber-100">
                Sign in to continue from your previous page. Use a demo account below.
              </div>
            ) : null}

            {error ? (
              <div
                className="mt-8 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-center text-base font-semibold text-rose-900 shadow-sm ring-1 ring-rose-100"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <form className={`space-y-6 ${from || error ? "mt-6" : "mt-10"}`} onSubmit={handleSubmit}>
              <div>
                <label htmlFor="login-email" className="mb-2.5 block text-lg font-semibold text-slate-800">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="name@school.edu"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-2.5 block text-lg font-semibold text-slate-800">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex justify-end pt-1">
                <a
                  href="#forgot"
                  className="text-base font-semibold text-[#2563eb] underline-offset-2 transition hover:text-[#1e40af] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={busy}
                className={`group relative mt-1 w-full overflow-hidden rounded-xl py-4 text-lg font-bold text-white shadow-[0_14px_44px_-14px_rgb(37,99,235,0.75)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-14px_rgb(37,99,235,0.65)] active:translate-y-0 disabled:cursor-wait disabled:opacity-88 ${brandGradientBtn}`}
              >
                <span className="relative z-1">{busy ? "Signing in…" : "Sign in"}</span>
                <span
                  className="absolute inset-0 bg-linear-to-r from-white/0 via-white/22 to-white/0 opacity-0 transition duration-500 group-hover:opacity-100"
                  aria-hidden
                />
              </button>
            </form>

            {/* Demo credentials — badge cards */}
            <div className="mt-10 rounded-2xl border border-[#bfdbfe]/80 bg-linear-to-b from-sky-50/90 to-white/90 p-6 shadow-inner ring-1 ring-[#dbeafe]/90">
              <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[#2563eb]/80">Demo access</p>
              <ul className="mt-6 space-y-4">
                {demoAccounts.map(({ role, email, pass, badgeClass }) => (
                  <li
                    key={role}
                    className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white/95 px-5 py-4 shadow-sm ring-1 ring-slate-100/90 transition hover:border-[#bfdbfe] hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span
                      className={`inline-flex w-fit shrink-0 items-center rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide ring-1 ${badgeClass}`}
                    >
                      {role}
                    </span>
                    <div className="min-w-0 flex-1 text-right font-mono text-sm leading-relaxed text-slate-700 sm:text-base">
                      <span className="break-all">{email}</span>
                      <span className="mx-2 text-slate-300">·</span>
                      <span className="tabular-nums">{pass}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-9 text-center text-lg text-slate-600">
              Public site?{" "}
              <Link
                href="/landing"
                className="font-semibold text-[#2563eb] underline-offset-4 transition hover:text-[#1e40af] hover:underline"
              >
                View landing
              </Link>
            </p>
          </div>

          <p className="mt-10 text-center text-sm font-medium text-slate-400 sm:text-base">
            © {new Date().getFullYear()} E-Skool · Demo session (no backend)
          </p>
        </div>
      </div>
    </div>
  );
}
