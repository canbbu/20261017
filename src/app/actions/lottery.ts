"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { wedding } from "@/content/wedding";
import {
  emptyLotteryFields,
  lotteryFieldsFromForm,
  parseLotteryFields,
  type LotteryFields,
} from "@/lib/lottery";
import { hasEditSession, isEditPasswordConfigured, passwordsMatch, writeEditSession } from "@/lib/lottery-session";
import { deleteLotteryResult, isLotteryWriteConfigured, writeLotteryResult } from "@/lib/lottery-store";

export type LotteryActionState = {
  status: "idle" | "error" | "saved" | "cleared";
  message: string;
  fields: LotteryFields;
};

function refreshGuestPages() {
  revalidatePath("/");
  revalidatePath("/mom");
  revalidatePath("/gift");
  revalidatePath("/edit");
}

export async function unlockEdit(
  prev: LotteryActionState,
  formData: FormData,
): Promise<LotteryActionState> {
  if (!isEditPasswordConfigured()) {
    return {
      ...prev,
      status: "error",
      message: wedding.thanks.passwordMissing,
      fields: emptyLotteryFields(),
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!passwordsMatch(password)) {
    return {
      ...prev,
      status: "error",
      message: wedding.thanks.unauthorized,
      fields: emptyLotteryFields(),
    };
  }

  await writeEditSession();
  redirect("/edit");
}

export async function updateLottery(
  prev: LotteryActionState,
  formData: FormData,
): Promise<LotteryActionState> {
  const intent = String(formData.get("intent") ?? "");
  if (!(await hasEditSession())) {
    redirect("/edit");
  }

  if (!isLotteryWriteConfigured()) {
    return { ...prev, status: "error", message: wedding.thanks.unconfigured };
  }

  if (intent === "clear") {
    const deleted = await deleteLotteryResult();
    if (!deleted.ok) {
      return { ...prev, status: "error", message: wedding.thanks.unconfigured, fields: emptyLotteryFields() };
    }

    refreshGuestPages();
    return { status: "cleared", message: wedding.thanks.cleared, fields: emptyLotteryFields() };
  }

  if (intent !== "save") {
    return prev;
  }

  const fields = lotteryFieldsFromForm(formData);
  const parsed = parseLotteryFields(fields);
  if (!parsed.ok) {
    return { status: "error", message: wedding.thanks.invalid, fields };
  }

  const written = await writeLotteryResult(parsed.result);
  if (!written.ok) {
    return { status: "error", message: wedding.thanks.unconfigured, fields };
  }

  refreshGuestPages();
  return { status: "saved", message: wedding.thanks.saved, fields };
}
