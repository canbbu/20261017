import { describe, expect, it } from "vitest";
import { coupleNames, guestParentLine, heroCoupleNames } from "@/lib/content";
import { wedding } from "@/content/wedding";
import { getSafeMapLinks } from "@/lib/maps";
import { toSmsHref, toTelHref } from "@/lib/phone";
import { validateWeddingContent } from "@/lib/validate";

describe("wedding content contract", () => {
  it("keeps required names and a parseable date", () => {
    const result = validateWeddingContent();
    expect(result.ok).toBe(true);
    expect(wedding.couple.groom.name).not.toBe("");
    expect(wedding.couple.bride.name).not.toBe("");
  });

  it("keeps only https map links", () => {
    expect(getSafeMapLinks(wedding.event.mapLinks).some((link) => link.id === "google")).toBe(true);
    expect(getSafeMapLinks({
      google: "",
      naver: "http://map.naver.com",
      kakao: "https://map.kakao.com/test",
      tmap: "",
    })).toEqual([
      { id: "kakao", label: "카카오맵", href: "https://map.kakao.com/test" },
    ]);
  });

  it("builds tel and sms links from digits only", () => {
    expect(toTelHref("010-1234-5678")).toBe("tel:01012345678");
    expect(toSmsHref("010-1234-5678")).toBe("sms:01012345678");
    expect(toTelHref("")).toBeNull();
  });

  it("enables RSVP and stores groom-side account numbers from content", () => {
    expect(wedding.rsvp.enabled).toBe(true);
    expect(wedding.accounts.enabled).toBe(true);
    expect(wedding.accounts.items).toEqual([
      {
        side: "groom",
        holder: "이준명",
        bank: "농협",
        number: "483034-52-014970",
        relation: "부",
      },
      {
        side: "groom",
        holder: "최란옥",
        bank: "농협",
        number: "483034-56-218232",
        relation: "모",
      },
    ]);
  });

  it("points images at /images/", () => {
    expect(wedding.hero.src.startsWith("/images/")).toBe(true);
    expect(wedding.event.photo.src.startsWith("/images/")).toBe(true);
    expect(wedding.gallery.every((image) => image.src.startsWith("/images/"))).toBe(true);
  });

  it("points background music at /music/", () => {
    expect(wedding.music.enabled).toBe(true);
    expect(wedding.music.src).toBe("/music/something-stupid.mp3");
  });

  it("keeps footer names short and hero names labeled", () => {
    expect(coupleNames()).toBe("이영직 · 김지수");
    expect(heroCoupleNames()).toBe("신랑 이영직 · 신부 김지수");
  });

  it("builds guest parent lines from stored names only", () => {
    expect(guestParentLine(wedding.couple.groom.parents, "아들")).toBe("이준명 · 최란옥의 아들");
    expect(guestParentLine(wedding.couple.bride.parents, "딸")).toBe("김재동의 딸");
  });
});
