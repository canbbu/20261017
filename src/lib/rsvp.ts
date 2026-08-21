export type RsvpField = "name" | "attending" | "guestCount" | "meal" | "message" | "consent";

export type RsvpActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<RsvpField, string>>;
  publishedNote: PublicNote | null;
};

export const initialRsvpState: RsvpActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  publishedNote: null,
};

export function readRsvpActionState(state: RsvpActionState | null | undefined): RsvpActionState {
  return {
    status: state?.status ?? "idle",
    message: state?.message ?? "",
    fieldErrors: state?.fieldErrors ?? {},
    publishedNote: state?.publishedNote ?? null,
  };
}

export type RsvpParsedInput = {
  name: string;
  attending: "yes" | "no" | "";
  guestCount: string;
  meal: "yes" | "no" | "";
  message: string;
  publish?: boolean;
  consent: boolean;
};

export type RsvpRecord = {
  name: string;
  attending: boolean;
  guest_count: number;
  meal: "yes" | "no" | null;
  message: string | null;
  published: boolean;
  hidden: false;
  consent: true;
};

export type RsvpValidation =
  | { ok: true; record: RsvpRecord }
  | { ok: false; fieldErrors: Partial<Record<RsvpField, string>> };

export function parseRsvpFormData(formData: FormData): RsvpParsedInput {
  return {
    name: String(formData.get("name") ?? ""),
    attending: parseChoice(formData.get("attending")),
    guestCount: String(formData.get("guestCount") ?? ""),
    meal: parseChoice(formData.get("meal")),
    message: String(formData.get("message") ?? ""),
    publish: formData.get("publish") === "on" || formData.get("publish") === "true",
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  };
}

export function validateRsvpInput(input: RsvpParsedInput): RsvpValidation {
  const fieldErrors: Partial<Record<RsvpField, string>> = {};
  const name = input.name.replace(/\s+/g, " ").trim();

  if (name.length < 1) {
    fieldErrors.name = "이름을 입력해 주세요.";
  } else if (name.length > 40) {
    fieldErrors.name = "이름은 40자 이내로 적어 주세요.";
  }

  if (input.attending !== "yes" && input.attending !== "no") {
    fieldErrors.attending = "참석 여부를 선택해 주세요.";
  }

  const attending = input.attending === "yes";
  let guestCount = 0;
  let meal: "yes" | "no" | null = null;

  if (attending) {
    const parsedCount = Number.parseInt(input.guestCount, 10);
    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 20) {
      fieldErrors.guestCount = "인원은 1명에서 20명 사이로 적어 주세요.";
    } else {
      guestCount = parsedCount;
    }

    if (input.meal !== "yes" && input.meal !== "no") {
      fieldErrors.meal = "식사 여부를 선택해 주세요.";
    } else {
      meal = input.meal;
    }
  }

  if (!input.consent) {
    fieldErrors.consent = "개인정보 수집에 동의해 주세요.";
  }

  const message = input.message.trim();
  if (message.length > 300) {
    fieldErrors.message = "메시지는 300자 이내로 적어 주세요.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    record: {
      name,
      attending,
      guest_count: guestCount,
      meal,
      message: message.length > 0 ? message : null,
      published: Boolean(input.publish) && message.length > 0,
      hidden: false,
      consent: true,
    },
  };
}

export type PublicNote = {
  name: string;
  message: string;
};

export type PublicNoteSource = {
  name: string;
  message: string | null;
  published: boolean;
  hidden: boolean;
  createdAt: string;
};

export function selectPublicNotes(records: readonly PublicNoteSource[]): PublicNote[] {
  return records
    .filter((record) => {
      const message = record.message?.trim() ?? "";
      return record.published && !record.hidden && message.length > 0;
    })
    .sort((left, right) => (left.createdAt < right.createdAt ? 1 : -1))
    .map((record) => ({
      name: record.name,
      message: record.message?.trim() ?? "",
    }));
}

export function mergeOwnNote(
  notes: readonly PublicNote[],
  own: PublicNote | null,
): PublicNote[] {
  if (!own) {
    return [...notes];
  }

  return [own, ...notes.filter((note) => note.name !== own.name || note.message !== own.message)];
}

function parseChoice(value: FormDataEntryValue | null): "yes" | "no" | "" {
  return value === "yes" || value === "no" ? value : "";
}

export function rsvpInsertErrorMessage(error: { code?: string; message?: string }): string {
  if (error.code === "PGRST204" || (error.message ?? "").includes("schema cache")) {
    return "참석 저장 테이블이 아직 준비되지 않았습니다.";
  }

  return "전달하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}
