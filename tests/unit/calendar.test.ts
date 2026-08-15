import { describe, expect, it } from "vitest";
import { wedding } from "@/content/wedding";
import {
  buildMonthGrid,
  formatEventDateLine,
  getDateParts,
  weddingDayMatchesGrid,
} from "@/lib/calendar";

describe("calendar", () => {
  it("parses the wedding date in Asia/Seoul", () => {
    const parts = getDateParts(wedding.event.startsAt, wedding.event.timezone);
    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(8);
    expect(parts.day).toBe(15);
    expect(parts.weekday).toBe("토요일");
  });

  it("highlights only the wedding day in the same month", () => {
    const days = buildMonthGrid(wedding.event.startsAt, wedding.event.timezone);
    const highlighted = days.filter((day) => day.isWeddingDay);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]?.date.getDate()).toBe(15);
    expect(highlighted[0]?.date.getMonth()).toBe(7);
    expect(weddingDayMatchesGrid(wedding.event.startsAt, wedding.event.timezone)).toBe(true);
  });

  it("formats a date line without dash characters", () => {
    const line = formatEventDateLine(wedding.event.startsAt, wedding.event.timezone);
    expect(line).toContain("2026년 8월 15일 토요일");
    expect(line).not.toMatch(/[—–]/);
  });
});
