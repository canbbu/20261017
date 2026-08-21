import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BgmPlayer } from "@/components/interactive/BgmPlayer";

const labels = {
  src: "/music/something-stupid.mp3",
  title: "Something Stupid",
  playLabel: "배경음악 재생",
  pauseLabel: "배경음악 끄기",
};

let playSucceeds = true;

function installMediaMocks() {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    if (!playSucceeds) {
      return Promise.reject(Object.assign(new Error("NotAllowedError"), { name: "NotAllowedError" }));
    }

    Object.defineProperty(this, "paused", { configurable: true, get: () => false });
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });

  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    Object.defineProperty(this, "paused", { configurable: true, get: () => true });
    this.dispatchEvent(new Event("pause"));
  });
}

describe("BgmPlayer", () => {
  beforeEach(() => {
    playSucceeds = true;
    installMediaMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("tries autoplay and shows the pause control when it works", async () => {
    render(<BgmPlayer {...labels} />);
    expect(await screen.findByRole("button", { name: "배경음악 끄기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "배경음악 끄기" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("keeps a play button when autoplay is blocked", async () => {
    playSucceeds = false;
    render(<BgmPlayer {...labels} />);
    expect(await screen.findByRole("button", { name: "배경음악 재생" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "배경음악 재생" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("lets a guest start music after autoplay is blocked", async () => {
    playSucceeds = false;
    const user = userEvent.setup();
    render(<BgmPlayer {...labels} />);
    const button = await screen.findByRole("button", { name: "배경음악 재생" });

    playSucceeds = true;
    await user.click(button);

    expect(await screen.findByRole("button", { name: "배경음악 끄기" })).toBeInTheDocument();
  });

  it("starts on the first page tap when autoplay is blocked", async () => {
    playSucceeds = false;
    render(<BgmPlayer {...labels} />);
    await screen.findByRole("button", { name: "배경음악 재생" });

    playSucceeds = true;
    window.dispatchEvent(new Event("pointerdown"));

    expect(await screen.findByRole("button", { name: "배경음악 끄기" })).toBeInTheDocument();
  });

  it("lets a guest stop music after autoplay", async () => {
    const user = userEvent.setup();
    render(<BgmPlayer {...labels} />);
    const pause = await screen.findByRole("button", { name: "배경음악 끄기" });
    await user.click(pause);
    expect(await screen.findByRole("button", { name: "배경음악 재생" })).toBeInTheDocument();
  });

  it("does not restart after the guest turns music off", async () => {
    const user = userEvent.setup();
    render(<BgmPlayer {...labels} />);
    await user.click(await screen.findByRole("button", { name: "배경음악 끄기" }));
    expect(await screen.findByRole("button", { name: "배경음악 재생" })).toBeInTheDocument();

    const playSpy = vi.mocked(HTMLMediaElement.prototype.play);
    playSpy.mockClear();
    window.dispatchEvent(new Event("pointerdown"));

    await waitFor(() => {
      expect(playSpy).not.toHaveBeenCalled();
    });
    expect(screen.getByRole("button", { name: "배경음악 재생" })).toBeInTheDocument();
  });
});
