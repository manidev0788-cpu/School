/**
 * Human-readable student IDs: [AAA]-[DDMM]-[NN]
 * - AAA: first 3 letters A–Z from student name (uppercase)
 * - DDMM: day + month from date_of_birth (YYYY-MM-DD), or 0000 if unknown
 * - NN: 2+ digit running sequence per AAA-DDMM prefix (unique across DB)
 */

/** First 3 letters A–Z from name (uppercase); pad with X if fewer than 3 letters). */
export function namePrefix3(name) {
  const raw = String(name ?? "").trim();
  if (!raw) return "XXX";
  const letters = raw
    .toUpperCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^A-Z]/g, "");
  const slice = letters.slice(0, 3);
  return slice.padEnd(3, "X");
}

/** Calendar DDMM for an arbitrary calendar date (legacy preview / tooling). */
export function ddmmFromDate(d = new Date()) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}${month}`;
}

/**
 * DDMM from ISO date string YYYY-MM-DD (uses literal calendar parts from string).
 * Returns "0000" if missing or invalid (unknown DOB placeholder).
 */
export function ddmmFromIsoDate(iso) {
  if (!iso || typeof iso !== "string") return "0000";
  const m = iso.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "0000";
  const dd = m[3];
  const mm = m[2];
  return `${dd}${mm}`;
}

/** Normalize DOB arg for allocation: string YYYY-MM-DD or null. */
function normalizeDobIso(input) {
  if (input == null) return null;
  if (typeof input === "string") {
    const s = input.trim();
    if (!s) return null;
    const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : null;
  }
  return null;
}

/** Format sequence suffix: 01, 02, … 99, then 100, … */
export function formatSequenceSuffix(seq) {
  const n = Math.max(1, Math.floor(Number(seq)) || 1);
  return n <= 99 ? String(n).padStart(2, "0") : String(n);
}

/** Full id: AAA-DDMM-NN */
export function formatStudentRegistryId(prefix3, ddmm, sequenceNumber) {
  return `${prefix3}-${ddmm}-${formatSequenceSuffix(sequenceNumber)}`;
}

function extractTrailingSequence(studentId) {
  if (typeof studentId !== "string") return 0;
  const parts = studentId.trim().split("-");
  const last = parts[parts.length - 1];
  const n = Number.parseInt(last, 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Next unique student_id for name + DOB by scanning existing rows with same AAA-DDMM- prefix.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} name
 * @param {string | null | undefined} dateOfBirthIso YYYY-MM-DD from date_of_birth (required for correct DDMM)
 */
export async function allocateNextStudentId(supabase, name, dateOfBirthIso = null) {
  const prefix3 = namePrefix3(name);
  const iso = normalizeDobIso(dateOfBirthIso);
  const ddmm = ddmmFromIsoDate(iso ?? "");
  const patternPrefix = `${prefix3}-${ddmm}-`;

  const { data, error } = await supabase
    .from("students")
    .select("student_id")
    .not("student_id", "is", null)
    .like("student_id", `${patternPrefix}%`);

  if (error) {
    throw new Error(error.message || String(error.code ?? "Could not allocate student ID."));
  }

  let maxSeq = 0;
  for (const row of data ?? []) {
    const id = row.student_id;
    if (typeof id !== "string" || !id.startsWith(patternPrefix)) continue;
    maxSeq = Math.max(maxSeq, extractTrailingSequence(id));
  }

  return formatStudentRegistryId(prefix3, ddmm, maxSeq + 1);
}

/**
 * PATCH students missing student_id (safe for legacy rows). Updates list entries in order.
 * @param {(row: object) => object | null} rowToStudent maps DB row → UI student
 */
export async function backfillMissingStudentRegistryIds(supabase, students, rowToStudent) {
  const out = [...students];
  let changed = false;

  for (let i = 0; i < out.length; i += 1) {
    const s = out[i];
    if (String(s.studentId ?? "").trim()) continue;

    let inserted = false;
    for (let attempt = 0; attempt < 15; attempt += 1) {
      const sid = await allocateNextStudentId(supabase, s.name, s.dateOfBirth || null);
      const { data, error } = await supabase.from("students").update({ student_id: sid }).eq("id", s.id).select("*").single();

      if (!error && data) {
        const mapped = rowToStudent(data);
        if (mapped) {
          out[i] = mapped;
          changed = true;
          inserted = true;
        }
        break;
      }

      const code = error?.code ?? "";
      const msg = error?.message ?? "";
      if (code === "23505" || /duplicate key|unique constraint/i.test(msg)) continue;
      console.warn("[backfill student_id]", error?.message ?? error);
      break;
    }

    if (!inserted) {
      console.warn("[backfill student_id] giving up for student id=", s.id);
    }
  }

  return changed ? out : students;
}
