import { wedding } from "@/content/wedding";
import { parseWeddingDate } from "@/lib/calendar";
import { isHttpsUrl } from "@/lib/maps";
import { toDigits } from "@/lib/phone";

export type ValidationIssue = { field: string; message: string };

export function validateWeddingContent() {
  const issues: ValidationIssue[] = [];

  try {
    parseWeddingDate(wedding.event.startsAt);
  } catch {
    issues.push({ field: "event.startsAt", message: "ISO 날짜를 파싱할 수 없습니다." });
  }

  if (!wedding.couple.groom.name.trim()) {
    issues.push({ field: "couple.groom.name", message: "신랑 이름이 비어 있습니다." });
  }
  if (!wedding.couple.bride.name.trim()) {
    issues.push({ field: "couple.bride.name", message: "신부 이름이 비어 있습니다." });
  }

  const phones = [
    wedding.couple.groom.phone,
    wedding.couple.bride.phone,
    wedding.event.phone,
    ...wedding.couple.groom.parents.map((parent) => parent.phone),
    ...wedding.couple.bride.parents.map((parent) => parent.phone),
  ];

  phones.forEach((phone, index) => {
    if (!phone) return;
    if (toDigits(phone) !== phone.replace(/[^\d+]/g, "")) {
      issues.push({ field: `phone[${index}]`, message: "전화 링크에는 숫자와 +만 사용합니다." });
    }
  });

  Object.entries(wedding.event.mapLinks).forEach(([key, href]) => {
    if (!href) return;
    if (!isHttpsUrl(href)) {
      issues.push({ field: `mapLinks.${key}`, message: "지도 URL은 https만 허용합니다." });
    }
  });

  if (!wedding.hero.src.startsWith("/images/")) {
    issues.push({ field: "hero.src", message: "이미지 경로는 /images/ 하위여야 합니다." });
  }

  wedding.gallery.forEach((image, index) => {
    if (!image.src.startsWith("/images/")) {
      issues.push({
        field: `gallery[${index}].src`,
        message: "이미지 경로는 /images/ 하위여야 합니다.",
      });
    }
  });

  return {
    ok: issues.length === 0,
    issues,
  };
}
