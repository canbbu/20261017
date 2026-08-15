"use client";

import { ShareNetwork } from "@phosphor-icons/react";
import { copyText } from "@/lib/clipboard";
import { useToast } from "@/components/interactive/ToastRegion";

export function ShareButton({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const { announce } = useToast();

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    const result = await copyText(url);
    announce(
      result.ok
        ? "초대장 주소를 복사했습니다."
        : "주소 복사에 실패했습니다. 브라우저 주소창에서 복사해 주세요.",
    );
  }

  return (
    <button
      type="button"
      className="control inline-flex items-center justify-center gap-2 bg-accent px-5 text-[0.9375rem] text-canvas"
      onClick={handleShare}
    >
      <ShareNetwork size={18} weight="regular" aria-hidden="true" />
      초대장 공유
    </button>
  );
}
