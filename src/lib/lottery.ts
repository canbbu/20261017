import { wedding } from "@/content/wedding";

export const LOTTERY_ID = "halloween-jumbo-2026";

export type GroupTicket = {
  group: string;
  number: string;
};

export type LotteryResult = {
  first: GroupTicket[];
  second: GroupTicket[];
  third: GroupTicket[];
  fourth: string[];
  fifth: string[];
  sixth: string[];
};

export type LotteryField = keyof LotteryResult;

export type LotteryFields = Record<LotteryField, string>;

export type LotteryFieldErrors = Partial<Record<LotteryField, string>>;

export type GuestPhase =
  | { kind: "countdown" }
  | { kind: "preparing" }
  | { kind: "result"; result: LotteryResult };

export type RemainingParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const fields = ["first", "second", "third", "fourth", "fifth", "sixth"] as const;

export function emptyLotteryFields(): LotteryFields {
  return {
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
    sixth: "",
  };
}

export function drawAtDate(): Date {
  return new Date(wedding.thanks.drawAt);
}

export function guestPhase(now: Date, result: LotteryResult | null, drawAt = drawAtDate()): GuestPhase {
  if (now.getTime() < drawAt.getTime()) {
    return { kind: "countdown" };
  }

  if (!result) {
    return { kind: "preparing" };
  }

  return { kind: "result", result };
}

export function remainingParts(now: Date, drawAt = drawAtDate()): RemainingParts | null {
  const ms = drawAt.getTime() - now.getTime();
  if (ms <= 0) {
    return null;
  }

  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function digitGroups(line: string): string[] {
  return line.match(/\d+/g) ?? [];
}

function parseGroupLine(line: string, groupLength: number): GroupTicket | null {
  const groups = digitGroups(line);
  if (groups.length !== 2) {
    return null;
  }

  const [group, number] = groups;
  if (!group || !number || group.length !== groupLength || number.length !== 6) {
    return null;
  }

  return { group, number };
}

function parseEnding(line: string, length: number): string | null {
  const groups = digitGroups(line);
  if (groups.length !== 1 || groups[0]?.length !== length) {
    return null;
  }

  return groups[0] ?? null;
}

function parseLines<T>(raw: string, parseLine: (line: string) => T | null): T[] | null {
  const values: T[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const parsed = parseLine(trimmed);
    if (!parsed) {
      return null;
    }

    values.push(parsed);
  }

  if (values.length === 0) {
    return null;
  }

  return values;
}

export function parseLotteryFields(fieldsInput: LotteryFields):
  | { ok: true; result: LotteryResult }
  | { ok: false; fieldErrors: LotteryFieldErrors } {
  const first = parseLines(fieldsInput.first, (line) => parseGroupLine(line, 2));
  const second = parseLines(fieldsInput.second, (line) => parseGroupLine(line, 2));
  const third = parseLines(fieldsInput.third, (line) => parseGroupLine(line, 1));
  const fourth = parseLines(fieldsInput.fourth, (line) => parseEnding(line, 3));
  const fifth = parseLines(fieldsInput.fifth, (line) => parseEnding(line, 2));
  const sixth = parseLines(fieldsInput.sixth, (line) => parseEnding(line, 1));
  const parsed = { first, second, third, fourth, fifth, sixth };
  const fieldErrors: LotteryFieldErrors = {};

  for (const field of fields) {
    if (!parsed[field]) {
      fieldErrors[field] = wedding.thanks.fieldErrors[field];
    }
  }

  if (first && second && third && fourth && fifth && sixth) {
    return { ok: true, result: { first, second, third, fourth, fifth, sixth } };
  }

  return { ok: false, fieldErrors };
}

export function lotteryFieldsFromForm(formData: FormData): LotteryFields {
  return {
    first: String(formData.get("first") ?? ""),
    second: String(formData.get("second") ?? ""),
    third: String(formData.get("third") ?? ""),
    fourth: String(formData.get("fourth") ?? ""),
    fifth: String(formData.get("fifth") ?? ""),
    sixth: String(formData.get("sixth") ?? ""),
  };
}

function formatGroup(ticket: GroupTicket): string {
  return `${ticket.group}${wedding.thanks.groupSuffix} ${ticket.number}`;
}

export function fieldsFromResult(result: LotteryResult): LotteryFields {
  return {
    first: result.first.map(formatGroup).join("\n"),
    second: result.second.map(formatGroup).join("\n"),
    third: result.third.map(formatGroup).join("\n"),
    fourth: result.fourth.join("\n"),
    fifth: result.fifth.join("\n"),
    sixth: result.sixth.join("\n"),
  };
}

export function shiftNumber(number: string, delta: number): string | null {
  const value = Number(number) + delta;
  if (!Number.isSafeInteger(value) || value < 0 || value > 999999) {
    return null;
  }

  return String(value).padStart(6, "0");
}

export type AroundTicket = GroupTicket & { side: "before" | "after" };

export function aroundTickets(result: LotteryResult): AroundTicket[] {
  const tickets: AroundTicket[] = [];

  for (const ticket of result.first) {
    const before = shiftNumber(ticket.number, -1);
    const after = shiftNumber(ticket.number, 1);
    if (before) {
      tickets.push({ group: ticket.group, number: before, side: "before" });
    }
    if (after) {
      tickets.push({ group: ticket.group, number: after, side: "after" });
    }
  }

  return tickets;
}

export type DifferentGroupLine = {
  number: string;
  groups: string[];
};

export function differentGroupLines(result: LotteryResult): DifferentGroupLine[] {
  const groupsByNumber = new Map<string, string[]>();

  for (const ticket of result.first) {
    const groups = groupsByNumber.get(ticket.number) ?? [];
    if (!groups.includes(ticket.group)) {
      groups.push(ticket.group);
    }
    groupsByNumber.set(ticket.number, groups);
  }

  return [...groupsByNumber.entries()].map(([number, groups]) => ({ number, groups }));
}

export function formatDifferentGroup(line: DifferentGroupLine): string {
  const groups = line.groups.map((group) => `${group}${wedding.thanks.groupSuffix}`).join(", ");
  return `${groups}가 아닌 조 ${line.number}`;
}

export type TicketMatch =
  | { kind: "invalid" }
  | { kind: "none" }
  | { kind: "first"; group: string; number: string }
  | { kind: "second"; group: string; number: string }
  | { kind: "third"; groupDigit: string; number: string }
  | { kind: "differentGroup"; group: string; number: string; firstGroups: string[] }
  | { kind: "fourth"; ending: string }
  | { kind: "fifth"; ending: string }
  | { kind: "sixth"; ending: string }
  | { kind: "around"; side: "before" | "after"; group: string; number: string; firstNumber: string };

export type TicketReading =
  | { tone: "invalid" | "none"; title: string; lines: string[] }
  | { tone: "hit"; grade: string; prize: string; lines: string[] };

function hasBatchim(token: string): boolean {
  const last = token.replace(/\D/g, "").slice(-1);
  return last === "0" || last === "1" || last === "3" || last === "6" || last === "7" || last === "8";
}

function aroundStep(side: "before" | "after"): "작습니다" | "큽니다" {
  switch (side) {
    case "before":
      return "작습니다";
    case "after":
      return "큽니다";
    default: {
      const unreachable: never = side;
      return unreachable;
    }
  }
}

function topic(token: string): "은" | "는" {
  return hasBatchim(token) ? "은" : "는";
}

function subject(token: string): "이" | "가" {
  return hasBatchim(token) ? "이" : "가";
}

function andParticle(token: string): "과" | "와" {
  return hasBatchim(token) ? "과" : "와";
}

export function describeTicket(match: TicketMatch): TicketReading {
  const copy = wedding.thanks;
  const suffix = copy.groupSuffix;

  switch (match.kind) {
    case "invalid":
      return { tone: "invalid", title: copy.check.invalid, lines: [] };
    case "none":
      return { tone: "none", title: copy.check.noneTitle, lines: [copy.check.none] };
    case "first":
      return {
        tone: "hit",
        grade: copy.grades.first,
        prize: copy.prizes.first,
        lines: [`조 ${match.group} 번호 ${match.number}${subject(match.number)} 1등 번호와 같습니다.`],
      };
    case "second":
      return {
        tone: "hit",
        grade: copy.grades.second,
        prize: copy.prizes.second,
        lines: [`조 ${match.group} 번호 ${match.number}${subject(match.number)} 2등 번호와 같습니다.`],
      };
    case "around":
      return {
        tone: "hit",
        grade: copy.grades.around,
        prize: copy.prizes.around,
        lines: [
          `조 ${match.group}${topic(match.group)} 1등 조와 같습니다.`,
          `번호 ${match.number}${topic(match.number)} 1등 번호 ${match.firstNumber}보다 1 ${aroundStep(match.side)}.`,
        ],
      };
    case "third":
      return {
        tone: "hit",
        grade: copy.grades.third,
        prize: copy.prizes.third,
        lines: [
          `조 끝자리 ${match.groupDigit}${andParticle(match.groupDigit)} 번호 ${match.number}${subject(match.number)} 3등과 같습니다.`,
        ],
      };
    case "differentGroup":
      return {
        tone: "hit",
        grade: copy.grades.differentGroup,
        prize: copy.prizes.differentGroup,
        lines: [
          `번호 ${match.number}${topic(match.number)}`,
          `1등 ${match.firstGroups.map((group) => `${group}${suffix}`).join(", ")}의 번호와 같습니다.`,
          `조 ${match.group}${topic(match.group)} 1등 조와 다릅니다.`,
        ],
      };
    case "fourth":
      return {
        tone: "hit",
        grade: copy.grades.fourth,
        prize: copy.prizes.fourth,
        lines: [`끝 세 자리 ${match.ending}${subject(match.ending)} 4등입니다.`],
      };
    case "fifth":
      return {
        tone: "hit",
        grade: copy.grades.fifth,
        prize: copy.prizes.fifth,
        lines: [`끝 두 자리 ${match.ending}${subject(match.ending)} 5등입니다.`],
      };
    case "sixth":
      return {
        tone: "hit",
        grade: copy.grades.sixth,
        prize: copy.prizes.sixth,
        lines: [`끝 한 자리 ${match.ending}${subject(match.ending)} 6등입니다.`],
      };
    default: {
      const unreachable: never = match;
      return unreachable;
    }
  }
}

export function matchTicket(result: LotteryResult, groupRaw: string, numberRaw: string): TicketMatch {
  const group = groupRaw.trim();
  const number = numberRaw.trim();
  if (!/^\d{2}$/.test(group) || !/^\d{6}$/.test(number)) {
    return { kind: "invalid" };
  }

  if (result.first.some((ticket) => ticket.group === group && ticket.number === number)) {
    return { kind: "first", group, number };
  }

  for (const ticket of result.first) {
    if (ticket.group !== group) {
      continue;
    }
    if (shiftNumber(ticket.number, -1) === number) {
      return { kind: "around", side: "before", group, number, firstNumber: ticket.number };
    }
    if (shiftNumber(ticket.number, 1) === number) {
      return { kind: "around", side: "after", group, number, firstNumber: ticket.number };
    }
  }

  if (result.second.some((ticket) => ticket.group === group && ticket.number === number)) {
    return { kind: "second", group, number };
  }

  const third = result.third.find((ticket) => group.endsWith(ticket.group) && ticket.number === number);
  if (third) {
    return { kind: "third", groupDigit: third.group, number };
  }

  const firstGroups = result.first.filter((ticket) => ticket.number === number).map((ticket) => ticket.group);
  if (firstGroups.length > 0) {
    return { kind: "differentGroup", group, number, firstGroups };
  }

  const fourth = result.fourth.find((ending) => number.endsWith(ending));
  if (fourth) {
    return { kind: "fourth", ending: fourth };
  }
  const fifth = result.fifth.find((ending) => number.endsWith(ending));
  if (fifth) {
    return { kind: "fifth", ending: fifth };
  }
  const sixth = result.sixth.find((ending) => number.endsWith(ending));
  if (sixth) {
    return { kind: "sixth", ending: sixth };
  }

  return { kind: "none" };
}

function isGroupTicket(value: unknown, groupLength: number): value is GroupTicket {
  if (!value || typeof value !== "object") {
    return false;
  }

  const ticket = value as { group?: unknown; number?: unknown };
  return (
    typeof ticket.group === "string" &&
    typeof ticket.number === "string" &&
    ticket.group.length === groupLength &&
    /^\d+$/.test(ticket.group) &&
    ticket.number.length === 6 &&
    /^\d+$/.test(ticket.number)
  );
}

function isEndingList(value: unknown, length: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.length === length && /^\d+$/.test(item))
  );
}

function isGroupList(value: unknown, groupLength: number): value is GroupTicket[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => isGroupTicket(item, groupLength));
}

export function parseStoredResult(value: unknown): LotteryResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const payload = value as Partial<LotteryResult>;
  if (
    !isGroupList(payload.first, 2) ||
    !isGroupList(payload.second, 2) ||
    !isGroupList(payload.third, 1) ||
    !isEndingList(payload.fourth, 3) ||
    !isEndingList(payload.fifth, 2) ||
    !isEndingList(payload.sixth, 1)
  ) {
    return null;
  }

  return {
    first: payload.first,
    second: payload.second,
    third: payload.third,
    fourth: payload.fourth,
    fifth: payload.fifth,
    sixth: payload.sixth,
  };
}
