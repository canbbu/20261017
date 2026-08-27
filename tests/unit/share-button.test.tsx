import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShareButton, shareUrlForPath } from "@/components/interactive/ShareButton";
import { ToastProvider } from "@/components/interactive/ToastRegion";

describe("ShareButton", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to URL copy when Web Share is missing", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    vi.stubGlobal("location", { origin: "https://20261017.vercel.app" });
    render(
      <ToastProvider>
        <ShareButton title="우리, 결혼합니다" text="초대장" path="/" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "초대장 공유" }));
    expect(writeText).toHaveBeenCalledWith("https://20261017.vercel.app/");
    expect(await screen.findByText("초대장 주소를 복사했습니다.")).toBeInTheDocument();
  });

  it("shares the gift path from the gift page", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    vi.stubGlobal("location", { origin: "https://20261017.vercel.app" });
    render(
      <ToastProvider>
        <ShareButton title="우리, 결혼합니다" text="초대장" path="/gift" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "초대장 공유" }));
    expect(writeText).toHaveBeenCalledWith("https://20261017.vercel.app/gift");
  });

  it("shares the mom path from the mom page", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    vi.stubGlobal("location", { origin: "https://20261017.vercel.app" });
    render(
      <ToastProvider>
        <ShareButton title="우리, 결혼합니다" text="초대장" path="/mom" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "초대장 공유" }));
    expect(writeText).toHaveBeenCalledWith("https://20261017.vercel.app/mom");
  });
});

describe("shareUrlForPath", () => {
  it("keeps home, gift, and mom as distinct public URLs", () => {
    expect(shareUrlForPath("https://20261017.vercel.app", "/")).toBe("https://20261017.vercel.app/");
    expect(shareUrlForPath("https://20261017.vercel.app/", "/gift")).toBe(
      "https://20261017.vercel.app/gift",
    );
    expect(shareUrlForPath("https://20261017.vercel.app/", "/mom")).toBe(
      "https://20261017.vercel.app/mom",
    );
  });
});
