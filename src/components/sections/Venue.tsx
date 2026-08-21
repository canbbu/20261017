import { MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { Accordion } from "@/components/interactive/Accordion";
import { CopyButton } from "@/components/interactive/CopyButton";
import { Reveal } from "@/components/interactive/Reveal";
import { SafeImage } from "@/components/interactive/SafeImage";
import { wedding } from "@/content/wedding";
import { hasPhone, isPendingValue } from "@/lib/content";
import { getAppMapLinks } from "@/lib/maps";
import { toTelHref } from "@/lib/phone";

const TRANSPORT_LABELS = {
  subway: "지하철",
  bus: "버스",
  car: "자가용",
  parking: "주차",
} as const;

export function Venue() {
  const { event } = wedding;
  const mapLinks = getAppMapLinks(event.mapLinks);
  const venueTel = hasPhone(event.phone) ? toTelHref(event.phone) : null;
  const transportItems = (
    Object.keys(TRANSPORT_LABELS) as Array<keyof typeof TRANSPORT_LABELS>
  )
    .map((key) => ({ key, label: TRANSPORT_LABELS[key], value: event.transportation[key] }))
    .filter((item) => item.value.trim().length > 0);

  return (
    <section className="section bg-canvas" aria-labelledby="venue-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="venue-title" className="sr-only">
          오시는 길
        </h2>
        <div className="info-card">
          <p className="font-serif text-[1.25rem]">{event.venueName}</p>
          {isPendingValue(event.hall) ? null : (
            <p className="mt-1 text-[0.875rem] text-ink-muted">{event.hall}</p>
          )}
          <p className="mt-1 text-[0.875rem] text-ink-muted">{event.address}</p>

          {event.photo ? (
            <div className="mt-5 overflow-hidden rounded-[12px] bg-surface-muted">
              <SafeImage
                src={event.photo.src}
                alt={event.photo.alt}
                width={event.photo.width}
                height={event.photo.height}
                sizes="(max-width: 720px) calc(100vw - 88px), 672px"
                className="photo-preserve"
                fallbackLabel="예식장"
              />
            </div>
          ) : null}

          {mapLinks.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-2">
              {mapLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-button"
                  aria-label={`${link.label}에서 ${event.venueName} 열기`}
                >
                  <MapPin size={16} weight="regular" aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-2 gap-2">
            {isPendingValue(event.address) ? null : (
              <CopyButton
                value={event.address}
                label="주소 복사"
                className="min-w-0 [&_button]:w-full"
              />
            )}
            {venueTel ? (
              <a
                href={venueTel}
                className="control inline-flex w-full items-center justify-center gap-2 border border-line bg-surface px-4 text-[0.9375rem]"
                aria-label={`${event.venueName}에 전화하기`}
              >
                <Phone size={18} weight="regular" aria-hidden="true" />
                전화하기
              </a>
            ) : null}
          </div>

          {transportItems.length > 0 ? (
            <div className="mt-5 border-t border-line pt-2">
              {transportItems.map((item) => (
                <Accordion key={item.key} title={item.label}>
                  <p className="whitespace-pre-wrap">{item.value}</p>
                </Accordion>
              ))}
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
