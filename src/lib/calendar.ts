export type CalendarDay = {
  date: Date;
  inMonth: boolean;
  isWeddingDay: boolean;
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function parseWeddingDate(iso: string): Date {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    throw new Error("예식 날짜를 ISO 8601 형식으로 입력해 주세요.");
  }
  return date;
}

export function getDateParts(iso: string, timeZone: string) {
  const date = parseWeddingDate(iso);
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(read("year")),
    month: Number(read("month")),
    day: Number(read("day")),
    weekday: read("weekday"),
    hour: read("hour"),
    minute: read("minute"),
  };
}

export function formatEventDateLine(iso: string, timeZone: string): string {
  const { year, month, day, weekday, hour, minute } = getDateParts(iso, timeZone);
  return `${year}년 ${month}월 ${day}일 ${weekday} ${hour}:${minute}`;
}

export function formatHeroDateLine(iso: string, timeZone: string): string {
  const { year, month, day, weekday } = getDateParts(iso, timeZone);
  return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")} ${weekday}`;
}

export function getWeekdayLabels() {
  return WEEKDAY_LABELS;
}

export function buildMonthGrid(iso: string, timeZone: string): CalendarDay[] {
  const { year, month, day } = getDateParts(iso, timeZone);
  const first = new Date(year, month - 1, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: CalendarDay[] = [];

  for (let i = 0; i < startWeekday; i += 1) {
    cells.push({
      date: new Date(year, month - 1, i - startWeekday + 1),
      inMonth: false,
      isWeddingDay: false,
    });
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    cells.push({
      date: new Date(year, month - 1, date),
      inMonth: true,
      isWeddingDay: date === day,
    });
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]?.date ?? first;
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    cells.push({ date: next, inMonth: false, isWeddingDay: false });
  }

  return cells;
}

export function weddingDayMatchesGrid(iso: string, timeZone: string): boolean {
  const { day } = getDateParts(iso, timeZone);
  return buildMonthGrid(iso, timeZone).some(
    (cell) => cell.inMonth && cell.isWeddingDay && cell.date.getDate() === day,
  );
}
