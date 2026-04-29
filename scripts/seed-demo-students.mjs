#!/usr/bin/env node
/**
 * Inserts two structured demo rows into public.students (father_* / mother_* fields).
 *
 * Usage: node --env-file=.env.local scripts/seed-demo-students.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { allocateNextStudentId } from "../lib/student-id.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

/** Postgres column `class` — keep separate from reserved word `class`. */
function studentRow(r) {
  const { gradeClass, ...rest } = r;
  return {
    ...rest,
    ["class"]: gradeClass,
  };
}

function dobIsoFromPayload(payload) {
  const raw = payload.date_of_birth ?? payload.dob;
  if (raw == null || typeof raw !== "string") return null;
  const m = raw.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

const DEMO = [
  {
    name: "Harshit Sharma",
    gradeClass: "10",
    section: "A",
    roll_number: 101,
    dob: "2010-05-12",
    admission_date: "2024-04-01",
    father_name: "Rajesh Sharma",
    father_phone: "9876543210",
    father_occupation: "Business",
    father_qualification: "MBA",
    mother_name: "Sunita Sharma",
    mother_phone: "9123456780",
    mother_occupation: "Homemaker",
    mother_qualification: "Graduate",
    address: "House No 12, Sector 5",
    city: "Delhi",
    famous_landmark: "Near Metro Station",
    tuition: 8000,
    date_of_birth: "2010-05-12",
  },
  {
    name: "Kanika Verma",
    gradeClass: "8",
    section: "B",
    roll_number: 202,
    dob: "2012-09-25",
    admission_date: "2024-04-01",
    father_name: "Amit Verma",
    father_phone: "9812345678",
    father_occupation: "Engineer",
    father_qualification: "B.Tech",
    mother_name: "Neha Verma",
    mother_phone: "9098765432",
    mother_occupation: "Teacher",
    mother_qualification: "M.A",
    address: "Flat 45, Green Park",
    city: "Noida",
    famous_landmark: "Near City Mall",
    tuition: 7000,
    date_of_birth: "2012-09-25",
  },
];

async function insertWithGeneratedId(payload) {
  let lastError = null;
  const dobIso = dobIsoFromPayload(payload);
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const student_id = await allocateNextStudentId(supabase, payload.name, dobIso);
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
  for (const row of DEMO) {
    const payload = studentRow(row);
    const { data: existing } = await supabase
      .from("students")
      .select("id, student_id")
      .eq("name", payload.name)
      .eq("roll_number", payload.roll_number)
      .maybeSingle();

    if (existing?.id) {
      const patch = { ...payload };
      if (!existing.student_id?.trim()) {
        patch.student_id = await allocateNextStudentId(supabase, payload.name, dobIsoFromPayload(patch));
      }
      const { data, error } = await supabase.from("students").update(patch).eq("id", existing.id).select().single();
      if (error) throw error;
      console.log("Updated:", payload.name, "→ id", data.id, data.student_id ? `student_id=${data.student_id}` : "");
      continue;
    }

    const data = await insertWithGeneratedId(payload);
    console.log("Inserted:", payload.name, "→ id", data.id, data.student_id ? `student_id=${data.student_id}` : "");
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
