import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RsvpForm } from "@/components/interactive/RsvpForm";
import { ToastProvider } from "@/components/interactive/ToastRegion";

function renderForm(notes: Array<{ name: string; message: string }> = []) {
  return render(
    <ToastProvider>
      <RsvpForm notes={notes} />
    </ToastProvider>,
  );
}

describe("RsvpForm", () => {
  it("renders the name field without crashing on initial action state", () => {
    expect(() => renderForm()).not.toThrow();
    expect(screen.getByLabelText("이름")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "전달하기" })).toBeInTheDocument();
  });

  it("leaves 공개 off until the guest opts in", () => {
    renderForm();
    expect(screen.getByRole("checkbox", { name: "이 글을 청첩장에 공개합니다." })).not.toBeChecked();
  });

  it("shows existing 공개 축하글 under the form", () => {
    renderForm([{ name: "김하객", message: "축하해요" }]);
    expect(screen.getByRole("heading", { name: "축하글" })).toBeInTheDocument();
    expect(screen.getByText("김하객")).toBeInTheDocument();
    expect(screen.getByText("축하해요")).toBeInTheDocument();
  });

  it("does not thank the guest before a real submit succeeds", () => {
    renderForm();
    expect(screen.queryByText("감사합니다.")).not.toBeInTheDocument();
  });
});
