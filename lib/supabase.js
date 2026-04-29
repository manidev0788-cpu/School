import { createClient } from "@supabase/supabase-js";

/**
 * Browser-only Supabase client using public env vars.
 * Returns null if URL / anon key are missing or obvious tutorial placeholders.
 */
let browserClient = null;

/** Block only clearly unfinished template values — replace `your_publishable_key` in .env.local with your real key from Supabase. */
function isPlaceholderAnonKey(key) {
  const k = String(key ?? "")
    .trim()
    .toLowerCase();
  if (!k) return true;
  if (k.startsWith("paste_your")) return true;
  if (k === "sb_publishable_your_key_here") return true;
  if (k.includes("replace_me")) return true;
  return false;
}

function isPlaceholderProjectUrl(url) {
  const u = String(url ?? "")
    .trim()
    .toLowerCase();
  if (!u) return true;
  if (u.includes("your-project-ref.supabase.co")) return true;
  return false;
}

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isPlaceholderProjectUrl(url) || isPlaceholderAnonKey(anonKey)) return false;
  return Boolean(url?.trim() && anonKey?.trim());
}

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") return null;

  if (!isSupabaseConfigured()) {
    browserClient = null;
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!browserClient) {
    browserClient = createClient(url.trim(), anonKey.trim());
  }
  return browserClient;
}
