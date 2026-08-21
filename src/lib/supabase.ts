import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabasePublicConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/$/, "");
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  const configured =
    /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) &&
    !url.includes("YOUR_PROJECT_REF") &&
    anonKey.length > 40 &&
    !anonKey.includes("YOUR_");

  return { url, anonKey, configured };
}

export function isSupabaseConfigured() {
  return getSupabasePublicConfig().configured;
}

export function createSupabaseAnonClient(): SupabaseClient | null {
  const { url, anonKey, configured } = getSupabasePublicConfig();
  if (!configured) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
