import { classDisplayName } from "@/lib/classes-data";

export function paymentDateTodayIso() {
  const n = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}

/**
 * Creates or updates the single auto-assigned class tuition row per student (fee_source = class_assignment).
 * Avoids duplicates via lookup + update. Surfaces a warning if class_fees has no row for this grade key.
 */
export async function upsertAutoAssignmentFee(client, { studentId, studentName, classGrade, section }) {
  const gradeKey = String(classGrade ?? "").trim();
  const classLabel = classDisplayName({ grade: classGrade ?? "", section: section ?? "" });

  const { data: cf, error: cfErr } = await client.from("class_fees").select("fee_amount").eq("class_name", gradeKey).maybeSingle();

  if (cfErr) {
    return { ok: false, error: cfErr.message };
  }

  if (!cf) {
    return {
      ok: false,
      warning: `No tuition configured for class grade "${gradeKey}". Run supabase/ensure_class_fees_schema.sql (or class_fees.sql) in Supabase.`,
    };
  }

  const catalogAmount =
    typeof cf.fee_amount === "number" ? cf.fee_amount : Number.parseFloat(String(cf.fee_amount ?? 0));

  const today = paymentDateTodayIso();

  const { data: existing, error: exErr } = await client
    .from("fees")
    .select("id, amount, status, payment_date")
    .eq("student_id", studentId)
    .eq("fee_source", "class_assignment")
    .maybeSingle();

  if (exErr) {
    return { ok: false, error: exErr.message };
  }

  const basePayload = {
    student_id: studentId,
    student_name: studentName,
    class_label: classLabel,
    amount: catalogAmount,
    fee_source: "class_assignment",
  };

  if (existing?.id) {
    const { error: upErr } = await client
      .from("fees")
      .update({
        ...basePayload,
        status: existing.status,
        payment_date: existing.payment_date,
      })
      .eq("id", existing.id);

    if (upErr) {
      return { ok: false, error: upErr.message };
    }
    return { ok: true };
  }

  const { error: insErr } = await client.from("fees").insert({
    ...basePayload,
    status: "pending",
    payment_date: today,
  });

  if (insErr) {
    return { ok: false, error: insErr.message };
  }

  return { ok: true };
}
