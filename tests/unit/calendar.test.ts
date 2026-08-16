import { describe, expect, it } from "vitest";
import { wedding } from "@/content/wedding";
import {
  buildMonthGrid,
  formatEventDateLine,
  formatHeroDateLine,
  getDateParts,
  weddingDayMatchesGrid,
} from "@/lib/calendar";

describe("calendar", () => {
  it("parses the wedding date in Asia/Seoul", () => {
    const parts = getDateParts(wedding.event.startsAt, wedding.event.timezone);
    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(10);
    expect(parts.day).toBe(17);
    expect(parts.weekday).toBe("토요일");
  });

  it("highlights only the wedding day in the same month", () => {
    const days = buildMonthGrid(wedding.event.startsAt, wedding.event.timezone);
    const highlighted = days.filter((day) => day.isWeddingDay);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]?.date.getDate()).toBe(17);
    expect(highlighted[0]?.date.getMonth()).toBe(9);
    expect(weddingDayMatchesGrid(wedding.event.startsAt, wedding.event.timezone)).toBe(true);
  });

  it("formats a date line without dash characters", () => {
    const line = formatEventDateLine(wedding.event.startsAt, wedding.event.timezone);
    expect(line).toContain("2026년 10월 17일 토요일");
    expect(line).not.toMatch(/[—–]/);
  });

  it("formats the hero date as a compact SAT caption", () => {
    const line = formatHeroDateLine(wedding.event.startsAt, wedding.event.timezone);
    expect(line).toBe("2026. 10. 17 SAT");
    expect(line).not.toMatch(/[—–]/);
  });
});
