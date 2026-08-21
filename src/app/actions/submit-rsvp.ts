"use server";

import { parseRsvpFormData, rsvpInsertErrorMessage, validateRsvpInput, type RsvpActionState } from "@/lib/rsvp";
import { createSupabaseAnonClient } from "@/lib/supabase";

export async function submitRsvp(
  _prev: RsvpActionState,
  formData: FormData,
): Promise<RsvpActionState> {
  const parsed = parseRsvpFormData(formData);
  const validated = validateRsvpInput(parsed);

  if (!validated.ok) {
    return {
      status: "error",
      message: "입력 내용을 다시 확인해 주세요.",
      fieldErrors: validated.fieldErrors,
      publishedNote: null,
    };
  }

  const supabase = createSupabaseAnonClient();
  if (!supabase) {
    return {
      status: "error",
      message: "참석 확인이 아직 연결되지 않았습니다.",
      fieldErrors: {},
      publishedNote: null,
    };
  }

  const { error } = await supabase.from("rsvps").insert(validated.record);

  if (error) {
    return {
      status: "error",
      message: rsvpInsertErrorMessage(error),
      fieldErrors: {},
      publishedNote: null,
    };
  }

  return {
    status: "success",
    message: "참석 의사를 전달했습니다.",
    fieldErrors: {},
    publishedNote:
      validated.record.published && validated.record.message
        ? { name: validated.record.name, message: validated.record.message }
        : null,
  };
}
