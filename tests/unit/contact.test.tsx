import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Contact } from "@/components/sections/Contact";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) => <img alt={alt} src={src} />,
}));

describe("Contact", () => {
  it("shows childhood portraits with a heart between the couple", () => {
    const { container } = render(<Contact />);

    expect(screen.getByRole("img", { name: "꽃길 옆에 서 있는 어린 이영직" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "잔디밭에 앉아 있는 어린 김지수" })).toBeInTheDocument();
    expect(container.querySelector(".contact-heart")).not.toBeNull();
    expect(screen.getByRole("button", { name: "이영직 카톡 QR 보기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "김지수 카톡 QR 보기" })).toBeInTheDocument();
  });
});
