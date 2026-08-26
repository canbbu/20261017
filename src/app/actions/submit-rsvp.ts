"use server";

import {
  ownNoteFromRecord,
  parseRsvpFormData,
  rsvpInsertErrorMessage,
  validateRsvpInput,
  type RsvpActionState,
} from "@/lib/rsvp";
import { createSupabaseAnonClient } from "@/lib/supabase";

function failedRsvpState(
  message: string,
  fieldErrors: RsvpActionState["fieldErrors"] = {},
): RsvpActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    ownNote: null,
    published: false,
  };
}

export async function submitRsvp(
  _prev: RsvpActionState,
  formData: FormData,
): Promise<RsvpActionState> {
  const parsed = parseRsvpFormData(formData);
  const validated = validateRsvpInput(parsed);

  if (!validated.ok) {
    return failedRsvpState("입력 내용을 다시 확인해 주세요.", validated.fieldErrors);
  }

  const supabase = createSupabaseAnonClient();
  if (!supabase) {
    return failedRsvpState("참석 확인이 아직 연결되지 않았습니다.");
  }

  const { error } = await supabase.from("rsvps").insert(validated.record);

  if (error) {
    return failedRsvpState(rsvpInsertErrorMessage(error));
  }

  return {
    status: "success",
    message: "참석 의사를 전달했습니다.",
    fieldErrors: {},
    ownNote: ownNoteFromRecord(validated.record),
    published: validated.record.published,
  };
}
