import { describe, expect, it } from "vitest";
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

  it("does not render map buttons for empty or non-https links", () => {
    expect(getSafeMapLinks(wedding.event.mapLinks)).toEqual([]);
    expect(getSafeMapLinks({
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

  it("keeps RSVP and accounts disabled until real data exists", () => {
    expect(wedding.rsvp.enabled).toBe(false);
    expect(wedding.accounts.enabled).toBe(false);
    expect(wedding.accounts.items).toHaveLength(0);
  });

  it("points images at /images/", () => {
    expect(wedding.hero.src.startsWith("/images/")).toBe(true);
    expect(wedding.gallery.every((image) => image.src.startsWith("/images/"))).toBe(true);
  });
});
