import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvitationPage } from "@/components/sections/InvitationPage";
import { ToastProvider } from "@/components/interactive/ToastRegion";

vi.mock("@/lib/public-notes", () => ({
  listPublicNotes: vi.fn(async () => []),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("next/font/google", () => ({
  Allura: () => ({ className: "font-allura", variable: "--font-hero-allura" }),
  Italianno: () => ({ className: "font-italianno", variable: "--font-hero-italianno" }),
  Cormorant_Garamond: () => ({ className: "font-cormorant", variable: "--font-hero-cormorant" }),
}));

vi.mock("@/components/interactive/GalleryClient", () => ({
  GalleryClient: () => <div>gallery</div>,
}));

async function renderPage(
  props?: Parameters<typeof InvitationPage>[0],
) {
  const ui = await InvitationPage(props ?? {});
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe("InvitationPage", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("keeps attendance on the gift page with accounts", async () => {
    await renderPage({ showAccounts: true, sharePath: "/gift" });

    expect(screen.getByRole("heading", { name: "참석 의사" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "마음을 전하실 곳" })).toBeInTheDocument();
  });

  it("matches the gift page on /mom except attendance", async () => {
    await renderPage({ showAccounts: true, showRsvp: false, sharePath: "/mom" });

    expect(screen.queryByRole("heading", { name: "참석 의사" })).not.toBeInTheDocument();
    expect(screen.queryByText("참석 여부를 알려 주시면 자리를 준비하는 데 도움이 됩니다.")).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "참석 여부" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "마음을 전하실 곳" })).toBeInTheDocument();
  });
});
