"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useId, useState } from "react";

export function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-line">
      <button
        type="button"
        className="control flex w-full items-center justify-between py-3 text-left text-[0.9375rem]"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{title}</span>
        <CaretDown
          size={16}
          weight="regular"
          aria-hidden="true"
          className={open ? "rotate-180" : undefined}
        />
      </button>
      {open ? (
        <div id={panelId} className="pb-4 text-[1rem] text-ink-muted">
          {children}
        </div>
      ) : null}
    </div>
  );
}
