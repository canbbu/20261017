import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RsvpForm } from "@/components/interactive/RsvpForm";
import { ToastProvider } from "@/components/interactive/ToastRegion";
import type { RsvpActionState } from "@/lib/rsvp";

vi.mock("@/app/actions/submit-rsvp", async () => {
  const rsvp = await import("@/lib/rsvp");
  return {
    submitRsvp: vi.fn(async (_prev: RsvpActionState, formData: FormData): Promise<RsvpActionState> => {
      const validated = rsvp.validateRsvpInput(rsvp.parseRsvpFormData(formData));
      if (!validated.ok) {
        return {
          status: "error",
          message: "입력 내용을 다시 확인해 주세요.",
          fieldErrors: validated.fieldErrors,
          ownNote: null,
          published: false,
        };
      }

      return {
        status: "success",
        message: "참석 의사를 전달했습니다.",
        fieldErrors: {},
        ownNote: rsvp.ownNoteFromRecord(validated.record),
        published: validated.record.published,
      };
    }),
  };
});

function renderForm(notes: Array<{ name: string; message: string }> = []) {
  return render(
    <ToastProvider>
      <RsvpForm notes={notes} />
    </ToastProvider>,
  );
}

async function submitGuest(
  options: { name: string; message?: string; publish?: boolean },
) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("이름"), options.name);
  await user.click(screen.getByRole("radio", { name: "불참" }));
  if (options.message) {
    await user.type(screen.getByRole("textbox", { name: "축하글" }), options.message);
  }
  if (options.publish) {
    await user.click(screen.getByRole("checkbox", { name: "이 글을 청첩장에 공개합니다." }));
  }
  await user.click(
    screen.getByRole("checkbox", { name: "이름과 참석 인원 정보를 예식 준비에 사용하는 데 동의합니다." }),
  );
  await user.click(screen.getByRole("button", { name: "전달하기" }));
  return user;
}

describe("RsvpForm", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

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
    expect(screen.queryByText("참석 의사를 전달했습니다.")).not.toBeInTheDocument();
  });

  it("puts a published 축하글 at the top of the public list", async () => {
    renderForm([{ name: "김가", message: "축하해요" }]);
    await submitGuest({
      name: "이가",
      message: "못 가서 아쉬워요",
      publish: true,
    });

    expect(await screen.findByText("참석 의사를 전달했습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "전달한 축하글" })).not.toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("못 가서 아쉬워요");
    expect(items[0]).toHaveTextContent("이가");
    expect(items[1]).toHaveTextContent("김가");
  });

  it("shows a private 축하글 in the success area without adding it to the public list", async () => {
    renderForm([{ name: "김가", message: "축하해요" }]);
    await submitGuest({ name: "이가", message: "비밀 글" });

    expect(await screen.findByRole("heading", { name: "전달한 축하글" })).toBeInTheDocument();
    expect(screen.getByText("비밀 글")).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("김가");
    expect(items[0]).not.toHaveTextContent("이가");
  });

  it("does not invent a 축하글 list when the guest only sent attendance", async () => {
    renderForm();
    await submitGuest({ name: "이가" });

    expect(await screen.findByText("참석 의사를 전달했습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "축하글" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "전달한 축하글" })).not.toBeInTheDocument();
  });
});
