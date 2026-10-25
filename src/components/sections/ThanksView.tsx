import { wedding } from "@/content/wedding";
import { type GuestPhase } from "@/lib/lottery";
import { Countdown } from "@/components/interactive/Countdown";
import { Reveal } from "@/components/interactive/Reveal";
import { TicketCheck } from "@/components/interactive/TicketCheck";
import { LotteryBoard } from "@/components/sections/LotteryBoard";

function LotteryPhase({ phase, initialNow }: { phase: GuestPhase; initialNow: string }) {
  switch (phase.kind) {
    case "countdown":
      return <Countdown drawAt={wedding.thanks.drawAt} initialNow={initialNow} />;
    case "preparing":
      return <p className="lottery-status">{wedding.thanks.preparing}</p>;
    case "result":
      return (
        <>
          <LotteryBoard result={phase.result} />
          <TicketCheck result={phase.result} />
        </>
      );
    default: {
      const unreachable: never = phase;
      return unreachable;
    }
  }
}

function ThanksTitle() {
  const title = wedding.thanks.lotteryTitle;
  const splitAt = title.indexOf(" ");
  if (splitAt < 0) {
    return <h1 className="section-title thanks-title">{title}</h1>;
  }

  const year = title.slice(0, splitAt);
  const name = title.slice(splitAt + 1);

  return (
    <h1 className="section-title thanks-title">
      <span className="thanks-title-line">{year}</span> <span className="thanks-title-line">{name}</span>
    </h1>
  );
}

export function ThanksView({ phase, initialNow }: { phase: GuestPhase; initialNow: string }) {
  return (
    <main className="page-shell">
      <section className="section thanks-section">
        <Reveal>
          <p className="thanks-sentence">{wedding.thanks.sentence}</p>
        </Reveal>
        <ThanksTitle />
        <LotteryPhase phase={phase} initialNow={initialNow} />
      </section>
    </main>
  );
}
