import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContactActions } from "@/components/interactive/ContactActions";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) => <img alt={alt} src={src} />,
}));

const qr = {
  src: "/images/qr/youngjik_qr.jpg" as const,
  alt: "이영직 카카오톡 친구 추가 QR 코드",
  width: 750,
  height: 925,
};

const photo = {
  src: "/youth/youngjik_youth.jpg" as const,
  alt: "꽃길 옆에 서 있는 어린 이영직",
  width: 4032,
  height: 3024,
  objectPosition: "center 18%",
};

describe("ContactActions", () => {
  it("shows the Kakao QR button instead of an empty contact message", () => {
    render(<ContactActions name="이영직" kakaoQr={qr} />);
    expect(screen.getByRole("button", { name: "이영직 카톡 QR 보기" })).toBeInTheDocument();
    expect(screen.queryByText("연락처는 아직 없습니다.")).not.toBeInTheDocument();
  });

  it("renders a childhood portrait instead of the placeholder icon", () => {
    render(<ContactActions name="이영직" kakaoQr={qr} photo={photo} />);
    expect(screen.getByRole("img", { name: "꽃길 옆에 서 있는 어린 이영직" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "이영직 카톡 QR 보기" })).toBeInTheDocument();
  });

  it("opens the QR dialog and restores focus when closed", async () => {
    const user = userEvent.setup();
    render(<ContactActions name="이영직" kakaoQr={qr} />);
    const open = screen.getByRole("button", { name: "이영직 카톡 QR 보기" });
    await user.click(open);
    expect(screen.getByRole("dialog", { name: "이영직 카톡 QR" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "이영직 카톡 QR" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "이영직 카카오톡 친구 추가 QR 코드" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "이영직 카톡 QR 닫기" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(open).toHaveFocus();
  });
});
