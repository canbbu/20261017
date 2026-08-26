"use client";

import { ChatCircle, Phone } from "@phosphor-icons/react";
import { useCallback, useState } from "react";
import { KakaoQrModal } from "@/components/interactive/KakaoQrModal";
import { SafeImage } from "@/components/interactive/SafeImage";
import type { KakaoQr, YouthPhoto } from "@/content/wedding";
import { formatPhone, toSmsHref, toTelHref } from "@/lib/phone";

export function ContactActions({
  name,
  phone,
  kakaoQr,
  photo,
}: {
  name: string;
  phone?: string;
  kakaoQr?: KakaoQr;
  photo?: YouthPhoto;
}) {
  const [qrOpen, setQrOpen] = useState(false);
  const closeQr = useCallback(() => setQrOpen(false), []);
  const tel = phone ? toTelHref(phone) : null;
  const sms = phone ? toSmsHref(phone) : null;
  const qrLabel = `${name} 카톡 QR 보기`;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {photo ? (
        <span className="youth-portrait">
          <SafeImage
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="88px"
            className="object-cover"
            style={{ objectPosition: photo.objectPosition }}
            fallbackLabel={name}
          />
        </span>
      ) : tel ? (
        <a href={tel} className="icon-circle" aria-label={`${name}에게 전화하기`}>
          <Phone size={22} weight="regular" aria-hidden="true" />
        </a>
      ) : kakaoQr ? (
        <span className="icon-circle" aria-hidden="true">
          <ChatCircle size={22} weight="regular" />
        </span>
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
      ) : null}
      {kakaoQr ? (
        <button
          type="button"
          className="quiet-button w-full"
          aria-label={qrLabel}
          onClick={() => setQrOpen(true)}
        >
          카톡 QR 보기
        </button>
      ) : null}
      {!tel && !kakaoQr ? (
        <p className="caption text-ink-muted">연락처는 아직 없습니다.</p>
      ) : null}
      {qrOpen && kakaoQr ? (
        <KakaoQrModal name={name} qr={kakaoQr} onClose={closeQr} />
      ) : null}
    </div>
  );
}
