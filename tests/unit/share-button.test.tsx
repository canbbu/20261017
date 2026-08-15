import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShareButton } from "@/components/interactive/ShareButton";
import { ToastProvider } from "@/components/interactive/ToastRegion";

describe("ShareButton", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("falls back to URL copy when Web Share is missing", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(
      <ToastProvider>
        <ShareButton title="우리, 결혼합니다" text="초대장" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "초대장 공유" }));
    expect(writeText).toHaveBeenCalled();
    expect(await screen.findByText("초대장 주소를 복사했습니다.")).toBeInTheDocument();
  });
});
