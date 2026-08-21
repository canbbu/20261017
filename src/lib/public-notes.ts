import { createSupabaseAnonClient } from "@/lib/supabase";
import { selectPublicNotes, type PublicNote } from "@/lib/rsvp";

export async function listPublicNotes(): Promise<PublicNote[]> {
  const supabase = createSupabaseAnonClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("name, message, published, hidden, created_at")
    .eq("published", true)
    .eq("hidden", false)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return selectPublicNotes(
    data.map((row) => ({
      name: String(row.name ?? ""),
      message: typeof row.message === "string" ? row.message : null,
      published: Boolean(row.published),
      hidden: Boolean(row.hidden),
      createdAt: String(row.created_at ?? ""),
    })),
  );
}
