import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublicNotes } from "@/components/sections/PublicNotes";

describe("PublicNotes", () => {
  it("shows 이름 and 축하글 without attendance details", () => {
    render(
      <PublicNotes
        notes={[
          { name: "이가", message: "못 가서 아쉬워요" },
          { name: "김하객", message: "축하해요" },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "축하글" })).toBeInTheDocument();
    expect(screen.getByText("이가")).toBeInTheDocument();
    expect(screen.getByText("못 가서 아쉬워요")).toBeInTheDocument();
    expect(screen.getByText("김하객")).toBeInTheDocument();
    expect(screen.getByText("축하해요")).toBeInTheDocument();
    expect(screen.queryByText("참석")).not.toBeInTheDocument();
    expect(screen.queryByText("불참")).not.toBeInTheDocument();
    expect(screen.queryByText("식사함")).not.toBeInTheDocument();
  });

  it("renders nothing when there are no 공개 축하글", () => {
    const { container } = render(<PublicNotes notes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
