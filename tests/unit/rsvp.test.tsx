import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Rsvp } from "@/components/sections/Rsvp";
import { wedding } from "@/content/wedding";

describe("Rsvp", () => {
  it("renders nothing while RSVP is disabled", () => {
    expect(wedding.rsvp.enabled).toBe(false);
    const { container } = render(<Rsvp />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("참석 여부 알리기")).not.toBeInTheDocument();
    expect(screen.queryByText(/접수되었습니다/)).not.toBeInTheDocument();
  });
});
