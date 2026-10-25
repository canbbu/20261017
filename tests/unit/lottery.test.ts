import { describe, expect, it } from "vitest";
import {
  aroundTickets,
  describeTicket,
  formatDifferentGroup,
  matchTicket,
  fieldsFromResult,
  guestPhase,
  parseLotteryFields,
  parseStoredResult,
  remainingParts,
  shiftNumber,
  type LotteryFields,
  type LotteryResult,
} from "@/lib/lottery";

const drawAt = new Date("2026-10-26T12:00:00+09:00");

const validFields: LotteryFields = {
  first: "34조 130231",
  second: "40 162606",
  third: "7조 178624",
  fourth: "887\n573",
  fifth: "07",
  sixth: "9",
};

function resultOf(fields: LotteryFields = validFields): LotteryResult {
  const parsed = parseLotteryFields(fields);
  if (!parsed.ok) {
    throw new Error("expected valid lottery fields");
  }

  return parsed.result;
}

describe("lottery numbers", () => {
  it("accepts one complete draw and keeps every grade", () => {
    const parsed = parseLotteryFields(validFields);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.result.first).toEqual([{ group: "34", number: "130231" }]);
    expect(parsed.result.fourth).toEqual(["887", "573"]);
    expect(fieldsFromResult(parsed.result).first).toBe("34조 130231");
  });

  it("rejects a missing grade and a line with the wrong width", () => {
    const missing = parseLotteryFields({ ...validFields, sixth: "  \n" });
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.fieldErrors.sixth).toBeTruthy();
    }

    const wideGroup = parseLotteryFields({ ...validFields, first: "034 130231" });
    expect(wideGroup.ok).toBe(false);

    const shortEnding = parseLotteryFields({ ...validFields, fifth: "7" });
    expect(shortEnding.ok).toBe(false);
  });

  it("derives the numbers beside first prize and skips a number outside six digits", () => {
    const result = resultOf();
    expect(aroundTickets(result)).toEqual([
      { group: "34", number: "130230", side: "before" },
      { group: "34", number: "130232", side: "after" },
    ]);
    expect(formatDifferentGroup({ number: "130231", groups: ["34"] })).toBe("34조가 아닌 조 130231");
    expect(shiftNumber("000000", -1)).toBeNull();
    expect(shiftNumber("999999", 1)).toBeNull();
  });

  it("hides saved numbers until the draw and shows preparing only after it", () => {
    const result = resultOf();
    expect(guestPhase(new Date("2026-10-25T13:00:00+09:00"), result, drawAt).kind).toBe("countdown");
    expect(guestPhase(new Date("2026-10-26T12:00:00+09:00"), null, drawAt).kind).toBe("preparing");
    expect(guestPhase(new Date("2026-10-26T12:00:01+09:00"), result, drawAt).kind).toBe("result");
    expect(remainingParts(new Date("2026-10-26T11:59:58+09:00"), drawAt)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 2,
    });
  });

  it("drops a stored payload that does not match the grades", () => {
    expect(parseStoredResult({ first: [{ group: "34", number: "130231" }] })).toBeNull();
    expect(parseStoredResult(resultOf())).toEqual(resultOf());
  });

  it("names the highest prize, including a number one away and a different group", () => {
    const result = resultOf();
    expect(matchTicket(result, "34", "130231").kind).toBe("first");
    expect(matchTicket(result, "34", "130230")).toMatchObject({ kind: "around", side: "before" });
    expect(matchTicket(result, "34", "130232")).toMatchObject({ kind: "around", side: "after" });
    expect(matchTicket(result, "35", "130231").kind).toBe("differentGroup");
    expect(matchTicket(result, "40", "162606").kind).toBe("second");
    expect(matchTicket(result, "17", "178624").kind).toBe("third");
    expect(matchTicket(result, "12", "100887").kind).toBe("fourth");
    expect(matchTicket(result, "12", "100007").kind).toBe("fifth");
    expect(matchTicket(result, "12", "100009").kind).toBe("sixth");
    expect(matchTicket(result, "12", "100008").kind).toBe("none");
    expect(matchTicket(result, "3", "130231").kind).toBe("invalid");
    const differentGroup = describeTicket(matchTicket(result, "35", "130231"));
    const third = describeTicket(matchTicket(result, "17", "178624"));
    if (differentGroup.tone !== "hit" || third.tone !== "hit") {
      throw new Error("expected a prize");
    }
    expect(differentGroup.lines).toEqual([
      "번호 130231은",
      "1등 34조의 번호와 같습니다.",
      "조 35는 1등 조와 다릅니다.",
    ]);
    expect(third.lines).toEqual(["조 끝자리 7과 번호 178624가 3등과 같습니다."]);
  });
});
