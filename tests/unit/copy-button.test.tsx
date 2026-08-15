import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/components/interactive/CopyButton";
import { ToastProvider } from "@/components/interactive/ToastRegion";

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderCopy(value: string) {
  return render(
    <ToastProvider>
      <CopyButton value={value} label="계좌번호 복사" />
    </ToastProvider>,
  );
}

describe("CopyButton", () => {
  it("does not render when the value is empty", () => {
    renderCopy("");
    expect(screen.queryByRole("button", { name: "계좌번호 복사" })).not.toBeInTheDocument();
  });

  it("announces success through a live region", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    renderCopy("카카오뱅크 3333-00-0000000");
    await user.click(screen.getByRole("button", { name: "계좌번호 복사" }));
    expect(await screen.findByText("복사했습니다.")).toBeInTheDocument();
    expect(screen.getByText("복사했습니다.").closest("[aria-live]")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("shows selectable text after a copy failure", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    renderCopy("카카오뱅크 3333-00-0000000");
    await user.click(screen.getByRole("button", { name: "계좌번호 복사" }));
    expect(await screen.findByText("카카오뱅크 3333-00-0000000")).toBeInTheDocument();
  });
});
