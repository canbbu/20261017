import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroLayers } from "@/components/sections/HeroLayers";
import { wedding } from "@/content/wedding";

vi.mock("next/image", () => ({
  default: ({
    alt,
    className,
    src,
  }: {
    alt: string;
    className?: string;
    src?: string;
  }) => <img alt={alt} className={className} src={typeof src === "string" ? src : undefined} />,
}));

vi.mock("next/font/google", () => ({
  Allura: () => ({ className: "font-allura", variable: "--font-hero-allura" }),
  Cormorant_Garamond: () => ({ className: "font-cormorant", variable: "--font-hero-cormorant" }),
}));

describe("HeroLayers", () => {
  it("stacks the photograph, script PNG, and HTML names and date", () => {
    render(<HeroLayers />);

    expect(screen.getByRole("img", { name: wedding.hero.alt })).toHaveClass("hero-layers__photo-image");
    expect(document.querySelector(".hero-layers__script-image")).toHaveAttribute("src", wedding.heroScript.src);
    expect(screen.getByRole("heading", { name: "We're getting married" })).toHaveClass("sr-only");
    expect(screen.getByText(new RegExp(wedding.couple.groom.name))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(wedding.couple.bride.name))).toBeInTheDocument();
    expect(screen.getByText("2026. 10. 17 SAT")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "히어로 시안" })).not.toBeInTheDocument();
  });
});
