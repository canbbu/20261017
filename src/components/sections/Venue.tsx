import { Car, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { wedding } from "@/content/wedding";
import { Accordion } from "@/components/interactive/Accordion";
import { CopyButton } from "@/components/interactive/CopyButton";
import { Reveal } from "@/components/interactive/Reveal";
import { isPendingValue } from "@/lib/content";
import { getDirectionsHref, getSafeMapLinks } from "@/lib/maps";
import { hasPhone } from "@/lib/content";
import { toTelHref } from "@/lib/phone";

const TRANSPORT_LABELS = {
  subway: "지하철",
  bus: "버스",
  car: "자가용",
  parking: "주차",
} as const;

export function Venue() {
  const { event } = wedding;
  const mapLinks = getSafeMapLinks(event.mapLinks);
  const google = mapLinks.find((link) => link.id === "google");
  const extraMaps = mapLinks.filter((link) => link.id !== "google");
  const directions = getDirectionsHref(event.address);
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
          <div className="flex gap-4">
            <div className="grid size-[72px] shrink-0 place-items-center rounded-[12px] bg-surface-muted text-accent">
              <MapPin size={28} weight="regular" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-[1.25rem]">{event.venueName}</p>
              {isPendingValue(event.hall) ? null : (
                <p className="mt-1 text-[0.875rem] text-ink-muted">{event.hall}</p>
              )}
              <p className="mt-1 text-[0.875rem] text-ink-muted">{event.address}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {google ? (
              <a
                href={google.href}
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-button"
                aria-label={`${event.venueName} 지도 보기`}
              >
                <MapPin size={16} weight="regular" aria-hidden="true" />
                지도 보기
              </a>
            ) : null}
            {directions ? (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-button"
                aria-label={`${event.venueName} 길찾기`}
              >
                <Car size={16} weight="regular" aria-hidden="true" />
                길찾기
              </a>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {isPendingValue(event.address) ? null : (
              <CopyButton value={event.address} label="주소 복사" />
            )}
            {venueTel ? (
              <a
                href={venueTel}
                className="control inline-flex items-center justify-center gap-2 border border-line bg-surface px-4 text-[0.9375rem]"
                aria-label={`${event.venueName}에 전화하기`}
              >
                <Phone size={18} weight="regular" aria-hidden="true" />
                전화하기
              </a>
            ) : null}
          </div>

          {extraMaps.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {extraMaps.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-button"
                  aria-label={`${link.label}에서 ${event.venueName} 길찾기 열기`}
                >
                  <MapPin size={16} weight="regular" aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}

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
