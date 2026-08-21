import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabasePublicConfig } from "@/lib/supabase";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Supabase public config", () => {
  it("treats placeholder env values as disconnected", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://YOUR_PROJECT_REF.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "YOUR_SUPABASE_ANON_KEY");
    expect(getSupabasePublicConfig().configured).toBe(false);
  });

  it("accepts a project URL and anon key", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://abcdefghijklmnop.supabase.co");
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiJ9.signature-padding-value",
    );
    expect(getSupabasePublicConfig().configured).toBe(true);
  });
});
