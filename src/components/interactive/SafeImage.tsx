"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function SafeImage({
  fallbackLabel,
  className,
  ...props
}: ImageProps & { fallbackLabel: string }) {
  const [failed, setFailed] = useState(false);
  const aspect =
    typeof props.width === "number" && typeof props.height === "number"
      ? `${props.width} / ${props.height}`
      : undefined;

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-muted px-4 text-center text-[0.875rem] text-ink-muted ${props.fill ? "absolute inset-0" : ""} ${className ?? ""}`}
        style={props.fill ? undefined : { aspectRatio: aspect }}
      >
        {fallbackLabel} 사진을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={props.alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
