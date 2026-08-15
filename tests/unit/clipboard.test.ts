import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText } from "@/lib/clipboard";

describe("copyText", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects empty values", async () => {
    await expect(copyText("   ")).resolves.toEqual({ ok: false, reason: "empty" });
  });

  it("copies through the clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(copyText("서울시 중구")).resolves.toEqual({ ok: true });
    expect(writeText).toHaveBeenCalledWith("서울시 중구");
  });

  it("returns denied when clipboard write fails", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    await expect(copyText("123-45-67890")).resolves.toEqual({
      ok: false,
      reason: "denied",
    });
  });
});
