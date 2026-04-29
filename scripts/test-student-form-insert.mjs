#!/usr/bin/env node
/**
 * Integration test: same payload path as Students UI (studentToRow + Supabase insert).
 *
 * Usage from repo root:
 *   node --env-file=.env.local scripts/test-student-form-insert.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * DB must match supabase/ensure_students_schema.sql (father/mother columns, dob, student_id, …).
 */

import { createClient } from "@supabase/supabase-js";
import { emptyStudentForm, tuitionForClassGrade, formatStudentDobForDb } from "../lib/students-data.js";
import { allocateNextStudentId } from "../lib/student-id.js";
import { rowToStudent, buildStudentPayload } from "../lib/students-supabase.js";

const TEST_NAME = "Rahul Test";

function logStep(msg) {
  console.log(`\n[test-student-form-insert] ${msg}`);
}

function fail(err, detail) {
  console.error("\n[test-student-form-insert] ERROR:", detail ?? err?.message ?? err);
  if (err && typeof err === "object" && err !== null && "stack" in err) {
    console.error(err.stack);
  }
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey || url.includes("your-project") || anonKey.includes("your-anon-key")) {
  fail(null, "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in environment (.env.local).");
}

const supabase = createClient(url, anonKey);

/** Mirrors StudentsPageClient.handleSubmit payload assembly */
function buildFormLikeUi() {
  const form = {
    ...emptyStudentForm(),
    name: TEST_NAME,
    classGrade: "10",
    section: "A",
    rollNo: "101",
    tuition: "5000",
    dob_day: "15",
    dob_month: "05",
    dob_year: "2008",
    gender: "Male",
    father_name: "Test Father",
    father_phone: "9999999999",
    mother_name: "",
    mother_phone: "",
    address: "Test Address",
    famousLandmark: "Near Temple",
    city: "Test City",
    state: "",
    zipCode: "",
    admissionDate: "",
    previousSchool: "",
  };
  return form;
}

async function cleanupPriorRun() {
  const { error } = await supabase.from("students").delete().eq("name", TEST_NAME).eq("roll_number", 101);
  if (error) {
    console.warn("[test-student-form-insert] cleanup warning:", error.message);
  }
}

async function insertNewStudentRow(payload, form) {
  let lastError = null;
  const dobIso = formatStudentDobForDb(form);
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const student_id = await allocateNextStudentId(supabase, TEST_NAME, dobIso || null);
    const { data, error } = await supabase.from("students").insert([{ ...payload, student_id }]).select().single();
    if (!error && data) return data;
    lastError = error;
    const code = error?.code ?? "";
    const msg = error?.message ?? "";
    if (code === "23505" || /duplicate key|unique constraint/i.test(msg)) continue;
    throw error;
  }
  throw lastError ?? new Error("Insert failed after retries");
}

async function main() {
  logStep("Cleanup any prior Rahul Test / roll 101 row…");
  await cleanupPriorRun();

  const form = buildFormLikeUi();
  const ladderAmt = tuitionForClassGrade(form.classGrade?.trim());
  const catalogAmt = typeof ladderAmt === "number" ? ladderAmt : null;

  const row = buildStudentPayload(form, typeof catalogAmt === "number" ? catalogAmt : null);

  logStep("Payload built via buildStudentPayload (same as UI save):");
  console.log(JSON.stringify(row, null, 2));

  logStep("Inserting via Supabase anon client…");
  const inserted = await insertNewStudentRow(row, form);

  logStep("Inserted row (raw):");
  console.log(JSON.stringify(inserted, null, 2));

  const mapped = rowToStudent(inserted);
  logStep("Round-trip rowToStudent (as UI table uses):");
  console.log(JSON.stringify(mapped, null, 2));

  const checks = [
    ["name", mapped?.name === TEST_NAME],
    ["studentId", typeof mapped?.studentId === "string" && mapped.studentId.length > 0],
    ["classGrade", mapped?.classGrade === "10"],
    ["section", mapped?.section === "A"],
    ["rollNo", mapped?.rollNo === "101"],
    ["tuition", mapped?.tuition === 5000],
    ["father_name", mapped?.father_name === "Test Father"],
    ["father_phone", mapped?.father_phone === "9999999999"],
    ["address", mapped?.address === "Test Address"],
    ["city", mapped?.city === "Test City"],
    ["famousLandmark", mapped?.famousLandmark === "Near Temple"],
    ["dateOfBirth", mapped?.dateOfBirth === "2008-05-15"],
  ];

  logStep("Assertions:");
  let failed = false;
  for (const [label, ok] of checks) {
    const pass = Boolean(ok);
    console.log(`  ${pass ? "✓" : "✗"} ${label}`);
    if (!pass) failed = true;
  }

  if (failed) {
    fail(null, "One or more assertions failed — see above.");
  }

  logStep("Verify fetch list (simulates Students table load)…");
  const { data: list, error: listErr } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (listErr) {
    fail(listErr, listErr.message);
  }

  const found = (list || []).some((r) => r.name === TEST_NAME && Number(r.roll_number) === 101);
  if (!found) {
    fail(null, "Inserted student not found in recent select(*) — UI load would not show this row.");
  }
  console.log("  ✓ Row appears in ordered select (UI-compatible).");

  logStep("Done — form pipeline + DB insert + read verified.");
}

main().catch((e) => fail(e));
