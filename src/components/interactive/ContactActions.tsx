"use client";

import { ChatCircle, Phone } from "@phosphor-icons/react";
import { formatPhone, toSmsHref, toTelHref } from "@/lib/phone";

export function ContactActions({
  name,
  phone,
}: {
  name: string;
  phone?: string;
}) {
  const tel = phone ? toTelHref(phone) : null;
  const sms = phone ? toSmsHref(phone) : null;

  return (
    <div className="flex flex-col gap-3 text-center">
      <div>
        <p className="font-serif text-[1rem]">{name}</p>
        {phone && tel ? (
          <p className="caption text-ink-muted">{formatPhone(phone)}</p>
        ) : null}
      </div>
      {tel && sms ? (
        <div className="grid grid-cols-2 gap-1.5">
          <a
            href={tel}
            className="control inline-flex items-center justify-center gap-1 border border-line bg-surface text-[0.8125rem]"
            aria-label={`${name}에게 전화하기`}
          >
            <Phone size={18} weight="regular" aria-hidden="true" />
            전화
          </a>
          <a
            href={sms}
            className="control inline-flex items-center justify-center gap-1 border border-line bg-surface text-[0.8125rem]"
            aria-label={`${name}에게 문자 보내기`}
          >
            <ChatCircle size={18} weight="regular" aria-hidden="true" />
            문자
          </a>
        </div>
      ) : (
        <p className="caption text-ink-muted">연락처는 아직 입력되지 않았습니다.</p>
      )}
    </div>
  );
}
