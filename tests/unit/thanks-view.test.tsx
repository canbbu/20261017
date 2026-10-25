import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThanksView } from "@/components/sections/ThanksView";
import { parseLotteryFields, type LotteryResult } from "@/lib/lottery";
import { wedding } from "@/content/wedding";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const result = (() => {
  const parsed = parseLotteryFields({
    first: "34조 130231",
    second: "40조 162606",
    third: "7조 178624",
    fourth: "887",
    fifth: "07",
    sixth: "9",
  });
  if (!parsed.ok) {
    throw new Error("expected a sample result");
  }

  return parsed.result;
})();

function renderPhase(phase: { kind: "countdown" } | { kind: "preparing" } | { kind: "result"; result: LotteryResult }) {
  render(<ThanksView phase={phase} initialNow="2026-10-25T13:00:00.000Z" />);
}

describe("thanks page", () => {
  it("shows the thank-you line and the time before the draw, without numbers", () => {
    renderPhase({ kind: "countdown" });
    expect(screen.getByText(wedding.thanks.sentence)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: wedding.thanks.lotteryTitle })).toBeInTheDocument();
    expect(screen.getByText(wedding.thanks.countdownLabel)).toBeInTheDocument();
    expect(screen.queryByText("130231")).not.toBeInTheDocument();
  });

  it("shows preparing when the draw has passed and nothing is saved", () => {
    renderPhase({ kind: "preparing" });
    expect(screen.getByText(wedding.thanks.preparing)).toBeInTheDocument();
    expect(screen.queryByText(wedding.thanks.countdownLabel)).not.toBeInTheDocument();
  });

  it("shows grades, derived prizes, and the overlap note after the numbers are saved", () => {
    renderPhase({ kind: "result", result });
    expect(screen.getByRole("heading", { name: "1등" })).toBeInTheDocument();
    expect(screen.getByText("34조 130231")).toBeInTheDocument();
    expect(screen.getByText("앞 34조 130230")).toBeInTheDocument();
    expect(screen.getByText("뒤 34조 130232")).toBeInTheDocument();
    expect(screen.getByText("34조가 아닌 조 130231")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "내 번호 확인" })).toBeInTheDocument();
    expect(screen.getByText("조 끝자리 7 178624")).toBeInTheDocument();
    expect(screen.getByText("끝 세 자리 887")).toBeInTheDocument();
    expect(screen.getByText(wedding.thanks.overlap)).toBeInTheDocument();
    expect(screen.getByText("2억 엔")).toBeInTheDocument();
  });

  it("tells a guest when their number is one away from first prize", async () => {
    const user = userEvent.setup();
    renderPhase({ kind: "result", result });
    await user.type(screen.getByLabelText("조"), "34");
    await user.type(screen.getByLabelText("번호"), "130230");
    await user.click(screen.getByRole("button", { name: "확인" }));
    expect(screen.getByRole("status")).toHaveTextContent("전후상");
    expect(screen.getByRole("status")).toHaveTextContent("1억 엔");
    expect(screen.getByRole("status")).toHaveTextContent("번호 130230은 1등 번호 130231보다 1 작습니다.");
  });
});
