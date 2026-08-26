import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroPhotoMotion, HeroTextMotion } from "@/components/interactive/HeroEntrance";

const copy = {
  headline: ["We're getting", "married"] as const,
  groomName: "이영직",
  brideName: "김지수",
  date: "2026. 10. 17 SAT",
  dateTime: "2026-10-17",
};

describe("HeroEntrance", () => {
  it("renders headline, names, and date as static HTML", () => {
    render(<HeroTextMotion {...copy} />);
    expect(screen.getByRole("heading")).toHaveTextContent("We're getting");
    expect(screen.getByRole("heading")).toHaveTextContent("married");
    expect(screen.getByText(/이영직/)).toBeInTheDocument();
    expect(screen.getByText(/김지수/)).toBeInTheDocument();
    expect(screen.getByText("2026. 10. 17 SAT")).toBeInTheDocument();
    expect(screen.getByText("2026. 10. 17 SAT").tagName).toBe("TIME");
  });

  it("keeps the photograph wrapper free of inline motion styles", () => {
    const { container } = render(
      <HeroPhotoMotion>
        <img alt="베일 아래에서 가까이 서서 서로를 바라보는 신랑과 신부" />
      </HeroPhotoMotion>,
    );
    const wrap = container.firstElementChild as HTMLElement;
    expect(wrap.tagName).toBe("DIV");
    expect(wrap).toHaveClass("hero__media");
    expect(wrap.getAttribute("style")).toBeNull();
  });
});
