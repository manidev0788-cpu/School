/**
 * Student profile photo uploads → Supabase Storage bucket `student-images`.
 */

export const STUDENT_IMAGE_BUCKET = "student-images";

/** 2 MB */
export const STUDENT_PROFILE_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

export const STUDENT_PROFILE_IMAGE_ACCEPT = {
  mime: ["image/jpeg", "image/png"],
  /** HTML accept attribute */
  inputAccept: ".jpg,.jpeg,.png,image/jpeg,image/png",
};

function extensionForMime(mime) {
  if (mime === "image/png") return "png";
  return "jpg";
}

export function validateProfileImageFile(file) {
  if (!(file instanceof File)) return "Invalid file.";
  if (!STUDENT_PROFILE_IMAGE_ACCEPT.mime.includes(file.type)) {
    return "Please choose a JPG or PNG image.";
  }
  if (file.size > STUDENT_PROFILE_IMAGE_MAX_BYTES) {
    return "Image must be 2 MB or smaller.";
  }
  return null;
}

/**
 * Upload to `student-images/{studentIdOrPending}/{uuid}.{ext}` and return public URL.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {File} file
 * @param {{ studentId?: string | number }} [opts]
 */
export async function uploadStudentProfileImage(supabase, file, opts = {}) {
  const bad = validateProfileImageFile(file);
  if (bad) throw new Error(bad);

  const folder =
    opts.studentId != null && String(opts.studentId).trim() !== ""
      ? String(opts.studentId).trim()
      : `pending-${crypto.randomUUID()}`;

  const ext = extensionForMime(file.type);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage.from(STUDENT_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (upErr) {
    throw new Error(upErr.message || "Could not upload image.");
  }

  const { data } = supabase.storage.from(STUDENT_IMAGE_BUCKET).getPublicUrl(path);
  const url = data?.publicUrl;
  if (!url) throw new Error("Could not get public URL for uploaded image.");
  return url;
}
