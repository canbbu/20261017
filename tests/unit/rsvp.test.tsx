import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Rsvp } from "@/components/sections/Rsvp";
import { ToastProvider } from "@/components/interactive/ToastRegion";
import { wedding } from "@/content/wedding";

describe("Rsvp", () => {
  it("shows the section without a fabricated success state", () => {
    expect(wedding.rsvp.enabled).toBe(true);
    render(
      <ToastProvider>
        <Rsvp />
      </ToastProvider>,
    );
    expect(screen.getByRole("heading", { name: "참석 의사" })).toBeInTheDocument();
    expect(screen.queryByText("접수되었습니다")).not.toBeInTheDocument();
    expect(screen.queryByText("참석 의사를 전달했습니다.")).not.toBeInTheDocument();
    expect(screen.queryByText("감사합니다.")).not.toBeInTheDocument();
  });
});
