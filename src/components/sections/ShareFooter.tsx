import { wedding } from "@/content/wedding";
import { ShareButton } from "@/components/interactive/ShareButton";
import { Reveal } from "@/components/interactive/Reveal";
import { formatEventDateLine } from "@/lib/calendar";
import { coupleNames } from "@/lib/content";

export function ShareFooter() {
  const names = coupleNames();
  const dateLine = formatEventDateLine(wedding.event.startsAt, wedding.event.timezone);

  return (
    <footer className="section bg-surface-muted pb-[max(96px,calc(64px+env(safe-area-inset-bottom)))]">
      <Reveal className="page-shell mx-auto text-center">
        <h2 className="section-title">공유</h2>
        <ShareButton title={`${names}, 결혼합니다`} text={wedding.copy.invitation} />
        <p className="mt-10 text-[1.125rem] font-medium">{names}</p>
        <p className="mt-2 text-ink-muted">{dateLine}</p>
      </Reveal>
    </footer>
  );
}
