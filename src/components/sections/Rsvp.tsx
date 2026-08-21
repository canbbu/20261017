import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/interactive/Reveal";
import { RsvpForm } from "@/components/interactive/RsvpForm";
import { isHttpsUrl } from "@/lib/maps";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { PublicNote } from "@/lib/rsvp";

export function Rsvp({ notes = [] }: { notes?: readonly PublicNote[] }) {
  if (!wedding.rsvp.enabled) {
    return null;
  }

  const external = wedding.rsvp.externalFormUrl;
  const hasExternalForm = isHttpsUrl(external);
  const hasSupabase = isSupabaseConfigured();

  return (
    <section className="section bg-canvas pt-0" aria-labelledby="rsvp-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="rsvp-title" className="section-title text-center">
          참석 의사
        </h2>
        <p className="prose-block mx-auto mb-8 text-center text-ink-muted">
          참석 여부를 알려 주시면 자리를 준비하는 데 도움이 됩니다.
        </p>
        {hasExternalForm ? (
          <a
            href={external}
            target="_blank"
            rel="noopener noreferrer"
            className="control mx-auto flex w-fit items-center justify-center gap-2 bg-accent px-5 text-[0.9375rem] text-canvas"
            aria-label="참석 의사 확인 폼을 새 탭에서 열기"
          >
            참석 여부 알리기
          </a>
        ) : hasSupabase ? (
          <RsvpForm notes={notes} />
        ) : (
          <p className="mx-auto max-w-[30rem] text-center text-ink-muted">
            참석 확인 폼이 아직 연결되지 않았습니다. 임의로 접수 완료 처리를 하지 않습니다.
          </p>
        )}
      </Reveal>
    </section>
  );
}
