import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "@/components/sections/Hero";
import { HeroScriptPreviewNav } from "@/components/sections/HeroScriptPreviewNav";
import { wedding } from "@/content/wedding";
import { parseHeroScriptPreviewId } from "@/lib/hero-script-preview";

vi.mock("next/image", () => ({
  default: ({
    alt,
    className,
  }: {
    alt: string;
    className?: string;
  }) => <img alt={alt} className={className} />,
}));

vi.mock("next/font/google", () => ({
  Allura: () => ({ className: "font-allura", variable: "--font-hero-allura" }),
  Italianno: () => ({ className: "font-italianno", variable: "--font-hero-italianno" }),
  Cormorant_Garamond: () => ({ className: "font-cormorant", variable: "--font-hero-cormorant" }),
}));

describe("Hero", () => {
  it("renders copy from wedding content over the photograph", () => {
    render(<Hero />);

    expect(screen.getByRole("img", { name: wedding.hero.alt })).toHaveClass("hero__image");
    expect(screen.getByRole("heading")).toHaveTextContent("We're getting");
    expect(screen.getByRole("heading")).toHaveTextContent("married");
    expect(screen.getByRole("heading")).toHaveClass("hero__headline", "font-allura");
    expect(screen.getByText(new RegExp(wedding.couple.groom.name))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(wedding.couple.bride.name))).toBeInTheDocument();
    expect(screen.getByText("2026. 10. 17 SAT")).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "히어로 서체 시안" })).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "영문 제목 서체" })).not.toBeInTheDocument();
  });

  it("applies a prototype script tone only when asked", () => {
    render(<Hero scriptTone="italianno" scriptClassName="font-italianno" />);

    expect(screen.getByRole("heading")).toHaveClass("hero__headline", "hero__headline--italianno", "font-italianno");
  });
});

describe("hero script preview", () => {
  it("falls back to Allura for unknown font query values", () => {
    expect(parseHeroScriptPreviewId(undefined)).toBe("allura");
    expect(parseHeroScriptPreviewId("comic")).toBe("allura");
    expect(parseHeroScriptPreviewId("brittany")).toBe("brittany");
  });

  it("links each of the four script options", () => {
    render(<HeroScriptPreviewNav current="allura" />);

    const nav = screen.getByRole("navigation", { name: "영문 제목 서체" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Allura" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Italianno" })).toHaveAttribute("href", "/prototype?font=italianno");
    expect(screen.getByRole("link", { name: "Brittany Signature" })).toHaveAttribute(
      "href",
      "/prototype?font=brittany",
    );
    expect(screen.getByRole("link", { name: "Amsterdam Four" })).toHaveAttribute(
      "href",
      "/prototype?font=amsterdam",
    );
  });
});
