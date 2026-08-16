"use client";

import { CaretRight, Gift } from "@phosphor-icons/react";
import { useState } from "react";
import { wedding } from "@/content/wedding";
import { Accordion } from "@/components/interactive/Accordion";
import { CopyButton } from "@/components/interactive/CopyButton";
import { Reveal } from "@/components/interactive/Reveal";

const SIDE_LABEL = {
  groom: "신랑측",
  bride: "신부측",
} as const;

export function Accounts() {
  const [open, setOpen] = useState(false);
  const groups = (["groom", "bride"] as const)
    .map((side) => ({
      side,
      items: wedding.accounts.items.filter((item) => item.side === side && item.number.trim()),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section className="section bg-canvas pt-0" aria-labelledby="accounts-title">
      <Reveal className="page-shell mx-auto">
        <div className="action-card overflow-hidden">
          <button
            type="button"
            className="control flex w-full items-center gap-4 px-4 py-4 text-left"
            aria-expanded={open}
            aria-controls="accounts-panel"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="icon-circle shrink-0" aria-hidden="true">
              <Gift size={22} weight="regular" />
            </span>
            <span className="min-w-0 flex-1">
              <h2 id="accounts-title" className="font-serif text-[1.05rem] font-normal">
                마음을 전하실 곳
              </h2>
              <span className="mt-1 block text-[0.8125rem] text-ink-muted">
                축의 계좌는 펼쳐서 확인하세요
              </span>
            </span>
            <CaretRight
              size={18}
              weight="regular"
              aria-hidden="true"
              className={open ? "rotate-90 text-ink-muted" : "text-ink-muted"}
            />
          </button>
          {open ? (
            <div id="accounts-panel" className="border-t border-line px-4 py-4">
              {groups.length === 0 ? (
                <p className="text-[0.9375rem] text-ink-muted">
                  계좌 정보는 아직 입력되지 않았습니다.
                </p>
              ) : (
                <div>
                  {groups.map((group) => (
                    <Accordion key={group.side} title={SIDE_LABEL[group.side]}>
                      <ul className="grid gap-5">
                        {group.items.map((item) => (
                          <li key={`${item.bank}-${item.number}`}>
                            <p className="font-medium">
                              {item.bank} {item.number}
                            </p>
                            <p className="caption text-ink-muted">
                              {item.relation} {item.holder}
                            </p>
                            <CopyButton
                              className="mt-3"
                              value={`${item.bank} ${item.number}`}
                              label="계좌번호 복사"
                            />
                          </li>
                        ))}
                      </ul>
                    </Accordion>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
