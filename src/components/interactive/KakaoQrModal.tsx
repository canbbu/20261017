"use client";

import { X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { SafeImage } from "@/components/interactive/SafeImage";
import type { KakaoQr } from "@/content/wedding";

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function KakaoQrModal({
  name,
  qr,
  onClose,
}: {
  name: string;
  qr: KakaoQr;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const historyState = { weddingKakaoQr: true };
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
    if (window.history.state?.weddingKakaoQr) {
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
      aria-label={`${name} 카톡 QR`}
      className="lightbox-shadow fixed inset-0 z-50 flex items-center justify-center bg-[rgb(32_35_31/0.72)] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      onClick={requestClose}
    >
      <motion.div
        className="relative w-full max-w-[20rem] overflow-hidden rounded-[12px] bg-surface"
        initial={reduce ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="control absolute right-2 top-2 z-10 inline-flex items-center justify-center bg-surface/90"
          aria-label={`${name} 카톡 QR 닫기`}
          onClick={requestClose}
        >
          <X size={22} weight="regular" aria-hidden="true" />
        </button>
        <SafeImage
          src={qr.src}
          alt={qr.alt}
          width={qr.width}
          height={qr.height}
          fallbackLabel="카톡 QR"
          className="h-auto w-full"
        />
      </motion.div>
    </motion.div>
  );
}
