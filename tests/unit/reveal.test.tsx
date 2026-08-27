import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/interactive/Reveal";

describe("Reveal", () => {
  it("keeps children visible even when IntersectionObserver never fires", () => {
    render(
      <Reveal>
        <p>멀리 떨어져 있던 시간 끝에</p>
      </Reveal>,
    );

    const copy = screen.getByText("멀리 떨어져 있던 시간 끝에");
    expect(copy).toBeVisible();
    expect(copy.parentElement).not.toHaveStyle({ opacity: "0" });
  });
});
