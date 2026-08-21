import { describe, expect, it } from "vitest";
import { getAppMapLinks, getSafeMapLinks } from "@/lib/maps";

describe("map helpers", () => {
  it("keeps naver and kakao app links and drops google from in-page buttons", () => {
    const links = {
      google: "https://maps.app.goo.gl/example",
      naver: "https://map.naver.com/p/search/example",
      kakao: "https://map.kakao.com/link/search/example",
      tmap: "",
    };

    expect(getSafeMapLinks(links).map((link) => link.id)).toEqual(["google", "naver", "kakao"]);
    expect(getAppMapLinks(links).map((link) => link.label)).toEqual(["네이버지도", "카카오맵"]);
  });
});
