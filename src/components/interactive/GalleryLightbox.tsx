"use client";

import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, useReducedMotion } from "motion/react";
import type { Swiper as SwiperType } from "swiper";
import type { GalleryImage } from "@/content/wedding";
import { SafeImage } from "@/components/interactive/SafeImage";
import "swiper/css";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function GalleryLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: readonly GalleryImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [index, setIndex] = useState(startIndex);
  const reduce = useReducedMotion();
  const titleId = useId();
  const count = images.length;
  const current = images[index];

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const historyState = { weddingLightbox: true };
    window.history.pushState(historyState, "");

    function onPopState() {
      onClose();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        window.history.back();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((node) => !node.hasAttribute("disabled"));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("popstate", onPopState);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("keydown", onKeyDown);
      if (previous instanceof HTMLElement) {
        previous.focus();
      }
    };
  }, [onClose]);

  function requestClose() {
    if (window.history.state?.weddingLightbox) {
      window.history.back();
      return;
    }
    onClose();
  }

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="lightbox-shadow fixed inset-0 z-50 flex flex-col bg-[rgb(32_35_31/0.94)] text-canvas"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))]">
        <p id={titleId} className="ui-label">
          {index + 1} / {count}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="control inline-flex items-center justify-center text-canvas"
          aria-label="사진 닫기"
          onClick={requestClose}
        >
          <X size={22} weight="regular" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center">
        <button
          type="button"
          className="control absolute left-2 z-10 hidden items-center justify-center text-canvas md:inline-flex"
          aria-label="이전 사진"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <CaretLeft size={24} weight="regular" aria-hidden="true" />
        </button>
        <Swiper
          className="h-full w-full"
          modules={[Keyboard, Navigation]}
          initialSlide={startIndex}
          keyboard={{ enabled: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
        >
          {images.map((image) => (
            <SwiperSlide key={image.src} className="flex items-center justify-center px-4">
              <motion.div
                className="flex h-full w-full items-center justify-center"
                initial={reduce ? false : { opacity: 0, scale: 0.965 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <SafeImage
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  fallbackLabel="갤러리"
                  className="mx-auto max-h-[80svh] w-auto object-contain"
                  sizes="100vw"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          className="control absolute right-2 z-10 hidden items-center justify-center text-canvas md:inline-flex"
          aria-label="다음 사진"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <CaretRight size={24} weight="regular" aria-hidden="true" />
        </button>
      </div>

      {current ? (
        <p className="caption px-5 pb-[max(16px,env(safe-area-inset-bottom))] text-center text-[rgb(248_248_244/0.82)]">
          {current.alt}
        </p>
      ) : null}
    </motion.div>
  );
}
