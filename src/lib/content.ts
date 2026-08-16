import { wedding } from "@/content/wedding";

export const PLACEHOLDER_VALUES = new Set([
  "신랑 이름",
  "신부 이름",
  "예식장 이름",
  "홀과 층",
  "도로명 주소",
]);

export function isPendingValue(value: string): boolean {
  return value.trim() === "" || PLACEHOLDER_VALUES.has(value.trim());
}

export function hasPhone(value?: string): boolean {
  return Boolean(value && /[\d+]/.test(value));
}

export function coupleNames(): string {
  return `${wedding.couple.groom.name} · ${wedding.couple.bride.name}`;
}

export function heroCoupleNames(): string {
  return `신랑 ${wedding.couple.groom.name} · 신부 ${wedding.couple.bride.name}`;
}

export function guestParentLine(
  parents: ReadonlyArray<{ name: string }>,
  childWord: "아들" | "딸",
): string | null {
  if (parents.length === 0) {
    return null;
  }

  return `${parents.map((parent) => parent.name).join(" · ")}의 ${childWord}`;
}
