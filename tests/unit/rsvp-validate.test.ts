import { describe, expect, it } from "vitest";
import { parseRsvpFormData, readRsvpActionState, mergeOwnNote, rsvpInsertErrorMessage, selectPublicNotes, validateRsvpInput } from "@/lib/rsvp";

describe("RSVP action state", () => {
  it("does not read field names off undefined server action state", () => {
    const state = readRsvpActionState(undefined);
    expect(state.fieldErrors.name).toBeUndefined();
    expect(state.status).toBe("idle");
  });
});

describe("RSVP validation", () => {
  it("rejects empty required fields without inventing a success payload", () => {
    const result = validateRsvpInput({
      name: " ",
      attending: "",
      guestCount: "",
      meal: "",
      message: "",
      consent: false,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.name).toBe("이름을 입력해 주세요.");
      expect(result.fieldErrors.attending).toBe("참석 여부를 선택해 주세요.");
      expect(result.fieldErrors.consent).toBe("개인정보 수집에 동의해 주세요.");
    }
  });

  it("accepts an attending guest", () => {
    const formData = new FormData();
    formData.set("name", " 김하객 ");
    formData.set("attending", "yes");
    formData.set("guestCount", "2");
    formData.set("meal", "yes");
    formData.set("message", "축하해요");
    formData.set("consent", "true");

    const result = validateRsvpInput(parseRsvpFormData(formData));
    expect(result).toEqual({
      ok: true,
      record: {
        name: "김하객",
        attending: true,
        guest_count: 2,
        meal: "yes",
        message: "축하해요",
        published: false,
        hidden: false,
        consent: true,
      },
    });
  });

  it("stores a decline without meal data", () => {
    const result = validateRsvpInput({
      name: "이손님",
      attending: "no",
      guestCount: "",
      meal: "",
      message: "",
      consent: true,
    });

    expect(result).toEqual({
      ok: true,
      record: {
        name: "이손님",
        attending: false,
        guest_count: 0,
        meal: null,
        message: null,
        published: false,
        hidden: false,
        consent: true,
      },
    });
  });
});

describe("공개 축하글", () => {
  it("does not publish unless the guest opts in and writes a note", () => {
    const privateNote = new FormData();
    privateNote.set("name", "김하객");
    privateNote.set("attending", "no");
    privateNote.set("message", "축하해요");
    privateNote.set("consent", "true");

    const unpublished = validateRsvpInput(parseRsvpFormData(privateNote));
    expect(unpublished).toMatchObject({
      ok: true,
      record: { message: "축하해요", published: false, hidden: false },
    });

    const publicNote = new FormData();
    publicNote.set("name", "김하객");
    publicNote.set("attending", "no");
    publicNote.set("message", "축하해요");
    publicNote.set("publish", "true");
    publicNote.set("consent", "true");

    const published = validateRsvpInput(parseRsvpFormData(publicNote));
    expect(published).toMatchObject({
      ok: true,
      record: { message: "축하해요", published: true, hidden: false },
    });

    const emptyPublish = new FormData();
    emptyPublish.set("name", "김하객");
    emptyPublish.set("attending", "no");
    emptyPublish.set("message", "  ");
    emptyPublish.set("publish", "true");
    emptyPublish.set("consent", "true");

    const skipped = validateRsvpInput(parseRsvpFormData(emptyPublish));
    expect(skipped).toMatchObject({
      ok: true,
      record: { message: null, published: false, hidden: false },
    });
  });

  it("keeps only opted-in notes, newest first, without attendance fields", () => {
    const notes = selectPublicNotes([
      {
        name: "김가",
        message: "축하해요",
        published: true,
        hidden: false,
        createdAt: "2026-01-02T00:00:00.000Z",
      },
      {
        name: "이가",
        message: "못 가서 아쉬워요",
        published: true,
        hidden: false,
        createdAt: "2026-01-03T00:00:00.000Z",
      },
      {
        name: "박가",
        message: "비밀",
        published: false,
        hidden: false,
        createdAt: "2026-01-04T00:00:00.000Z",
      },
      {
        name: "최가",
        message: "숨긴 글",
        published: true,
        hidden: true,
        createdAt: "2026-01-05T00:00:00.000Z",
      },
      {
        name: "정가",
        message: "   ",
        published: true,
        hidden: false,
        createdAt: "2026-01-06T00:00:00.000Z",
      },
    ]);

    expect(notes).toEqual([
      { name: "이가", message: "못 가서 아쉬워요" },
      { name: "김가", message: "축하해요" },
    ]);
  });

  it("puts the guest's own 공개 축하글 above notes already on the page", () => {
    expect(
      mergeOwnNote(
        [{ name: "김가", message: "축하해요" }],
        { name: "이가", message: "못 가서 아쉬워요" },
      ),
    ).toEqual([
      { name: "이가", message: "못 가서 아쉬워요" },
      { name: "김가", message: "축하해요" },
    ]);
    expect(mergeOwnNote([{ name: "김가", message: "축하해요" }], null)).toEqual([
      { name: "김가", message: "축하해요" },
    ]);
  });

  it("explains a missing rsvps schema instead of asking the guest to retry", () => {
    expect(
      rsvpInsertErrorMessage({
        code: "PGRST204",
        message: "Could not find the 'hidden' column of 'rsvps' in the schema cache",
      }),
    ).toBe("참석 저장 테이블이 아직 준비되지 않았습니다.");
  });
});
