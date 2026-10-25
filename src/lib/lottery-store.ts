import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { LOTTERY_ID, parseStoredResult, type LotteryResult } from "@/lib/lottery";
import { getSupabasePublicConfig } from "@/lib/supabase";

const LOTTERY_TABLE = "lottery_result";

export function isLotteryWriteConfigured(): boolean {
  return getServiceClient() !== null;
}

function getServiceClient(): SupabaseClient | null {
  const { url, configured } = getSupabasePublicConfig();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!configured || serviceKey.length <= 40 || serviceKey.includes("YOUR_")) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function readLotteryResult(): Promise<LotteryResult | null> {
  const { url, anonKey, configured } = getSupabasePublicConfig();
  if (!configured) {
    return null;
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const { data, error } = await supabase
    .from(LOTTERY_TABLE)
    .select("payload")
    .eq("id", LOTTERY_ID)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return parseStoredResult(data.payload);
}

export async function writeLotteryResult(result: LotteryResult): Promise<{ ok: true } | { ok: false }> {
  const supabase = getServiceClient();
  if (!supabase) {
    return { ok: false };
  }

  const { error } = await supabase.from(LOTTERY_TABLE).upsert({
    id: LOTTERY_ID,
    payload: result,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { ok: false };
  }

  return { ok: true };
}

export async function deleteLotteryResult(): Promise<{ ok: true } | { ok: false }> {
  const supabase = getServiceClient();
  if (!supabase) {
    return { ok: false };
  }

  const { error } = await supabase.from(LOTTERY_TABLE).delete().eq("id", LOTTERY_ID);
  if (error) {
    return { ok: false };
  }

  return { ok: true };
}
