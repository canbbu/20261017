import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HeroPhotoMotion, HeroTextMotion } from "@/components/interactive/HeroEntrance";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: reduce && query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) satisfies MediaQueryList,
  );
}

describe("HeroEntrance", () => {
  it("shows hero copy immediately when motion is reduced", () => {
    stubReducedMotion(true);
    render(
      <HeroTextMotion title="우리, 결혼합니다" names="신랑 이영직 · 신부 김지수" date="2026. 10. 17 SAT" />,
    );
    expect(screen.getByRole("heading", { name: "우리, 결혼합니다" })).toBeInTheDocument();
    expect(screen.getByText("신랑 이영직 · 신부 김지수")).toBeInTheDocument();
    expect(screen.getByText("2026. 10. 17 SAT")).toBeInTheDocument();
  });

  it("keeps the photograph visible without a fade wrapper when motion is reduced", () => {
    stubReducedMotion(true);
    const { container } = render(
      <HeroPhotoMotion>
        <img alt="푸른 잔디밭에 나란히 앉아 서로를 바라보는 신랑과 신부" />
      </HeroPhotoMotion>,
    );
    const wrap = container.firstElementChild as HTMLElement;
    expect(wrap.tagName).toBe("DIV");
    expect(wrap).toHaveClass("absolute", "inset-0");
    expect(wrap.getAttribute("style")).toBeNull();
  });
});
