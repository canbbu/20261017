import { ThanksView } from "@/components/sections/ThanksView";
import { guestPhase } from "@/lib/lottery";
import { readLotteryResult } from "@/lib/lottery-store";

export async function ThanksPage() {
  const now = new Date();
  const result = await readLotteryResult();

  return <ThanksView phase={guestPhase(now, result)} initialNow={now.toISOString()} />;
}
