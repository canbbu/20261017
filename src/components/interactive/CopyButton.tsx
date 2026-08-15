"use client";

import { Copy } from "@phosphor-icons/react";
import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { useToast } from "@/components/interactive/ToastRegion";

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const { announce } = useToast();
  const [failed, setFailed] = useState(false);

  if (!value.trim()) {
    return null;
  }

  async function handleCopy() {
    const result = await copyText(value);
    if (result.ok) {
      setFailed(false);
      announce("복사했습니다.");
      return;
    }
    setFailed(true);
    announce("복사에 실패했습니다. 아래 글을 직접 선택해 주세요.");
  }

  return (
    <div className={className}>
      <button
        type="button"
        className="control inline-flex items-center justify-center gap-2 bg-accent px-4 text-[0.9375rem] text-canvas"
        onClick={handleCopy}
      >
        <Copy size={18} weight="regular" aria-hidden="true" />
        {label}
      </button>
      {failed ? (
        <p className="caption mt-3 select-all text-ink-muted">{value}</p>
      ) : null}
    </div>
  );
}
