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
    <div className="flex flex-col items-center gap-3 text-center">
      {tel ? (
        <a href={tel} className="icon-circle" aria-label={`${name}에게 전화하기`}>
          <Phone size={22} weight="regular" aria-hidden="true" />
        </a>
      ) : (
        <span className="icon-circle" aria-hidden="true">
          <Phone size={22} weight="regular" />
        </span>
      )}
      <div>
        <p className="font-serif text-[1rem]">{name}</p>
        {phone && tel ? <p className="caption mt-1 text-ink-muted">{formatPhone(phone)}</p> : null}
      </div>
      {sms ? (
        <a
          href={sms}
          className="quiet-button w-full"
          aria-label={`${name}에게 문자 보내기`}
        >
          <ChatCircle size={16} weight="regular" aria-hidden="true" />
          문자
        </a>
      ) : (
        <p className="caption text-ink-muted">연락처는 아직 없습니다.</p>
      )}
    </div>
  );
}
