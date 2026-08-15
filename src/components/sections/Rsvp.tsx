import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/interactive/Reveal";
import { isHttpsUrl } from "@/lib/maps";

export function Rsvp() {
  if (!wedding.rsvp.enabled) {
    return null;
  }

  const external = wedding.rsvp.externalFormUrl;
  const hasForm = isHttpsUrl(external);

  return (
    <section className="section bg-surface-muted" aria-labelledby="rsvp-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="rsvp-title" className="section-title">
          참석 의사
        </h2>
        {hasForm ? (
          <a
            href={external}
            target="_blank"
            rel="noopener noreferrer"
            className="control inline-flex items-center justify-center gap-2 bg-accent px-5 text-[0.9375rem] text-canvas"
            aria-label="참석 의사 확인 폼을 새 탭에서 열기"
          >
            참석 여부 알리기
            <ArrowSquareOut size={16} weight="regular" aria-hidden="true" />
          </a>
        ) : (
          <p className="text-ink-muted">
            참석 확인 폼이 아직 연결되지 않았습니다. 임의로 접수 완료 처리를 하지 않습니다.
          </p>
        )}
      </Reveal>
    </section>
  );
}
