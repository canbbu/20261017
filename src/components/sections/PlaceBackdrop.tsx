import type { ReactNode } from "react";
import { SafeImage } from "@/components/interactive/SafeImage";
import { wedding } from "@/content/wedding";

export function PlaceBackdrop({ children }: { children: ReactNode }) {
  const photo = wedding.event.photo;
  if (!photo) {
    return children;
  }

  return (
    <div className="relative">
      <div className="sticky top-0 z-0 h-[100dvh]">
        <SafeImage
          src={photo.src}
          alt=""
          fill
          sizes="100vw"
          fallbackLabel="예식장"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="place-backdrop-wash" />
      </div>
      <div className="place-over relative z-10 -mt-[100dvh]">{children}</div>
    </div>
  );
}
