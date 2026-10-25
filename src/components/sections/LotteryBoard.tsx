import type { ReactNode } from "react";
import { wedding } from "@/content/wedding";
import {
  aroundTickets,
  differentGroupLines,
  formatDifferentGroup,
  type AroundTicket,
  type LotteryResult,
} from "@/lib/lottery";

function sideLabel(side: AroundTicket["side"]): string {
  switch (side) {
    case "before":
      return wedding.thanks.before;
    case "after":
      return wedding.thanks.after;
    default: {
      const unreachable: never = side;
      return unreachable;
    }
  }
}

function GradeHeading({ level, children }: { level: 2 | 3; children: string }) {
  if (level === 2) {
    return <h2 className="lottery-grade-title">{children}</h2>;
  }

  if (level === 3) {
    return <h3 className="lottery-grade-title">{children}</h3>;
  }

  const unreachable: never = level;
  return unreachable;
}

function Grade({
  level,
  title,
  prize,
  note,
  children,
}: {
  level: 2 | 3;
  title: string;
  prize: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="lottery-grade">
      <GradeHeading level={level}>{title}</GradeHeading>
      <p className="lottery-prize">{prize}</p>
      {note ? <p className="caption">{note}</p> : null}
      <div className="lottery-lines">{children}</div>
    </section>
  );
}

export function LotteryBoard({
  result,
  gradeLevel = 2,
}: {
  result: LotteryResult;
  gradeLevel?: 2 | 3;
}) {
  const copy = wedding.thanks;
  const around = aroundTickets(result);
  const sharedNumbers = differentGroupLines(result);

  return (
    <div>
      <Grade level={gradeLevel} title={copy.grades.first} prize={copy.prizes.first}>
        {result.first.map((ticket) => (
          <p key={`first-${ticket.group}-${ticket.number}`}>
            {ticket.group}
            {copy.groupSuffix} {ticket.number}
          </p>
        ))}
      </Grade>
      <Grade level={gradeLevel} title={copy.grades.around} prize={copy.prizes.around} note={copy.aroundNote}>
        {around.map((ticket) => (
          <p key={`${ticket.side}-${ticket.group}-${ticket.number}`}>
            {sideLabel(ticket.side)} {ticket.group}
            {copy.groupSuffix} {ticket.number}
          </p>
        ))}
      </Grade>
      <Grade level={gradeLevel} title={copy.grades.differentGroup} prize={copy.prizes.differentGroup}>
        {sharedNumbers.map((line) => (
          <p key={`group-${line.number}`}>{formatDifferentGroup(line)}</p>
        ))}
      </Grade>
      <Grade level={gradeLevel} title={copy.grades.second} prize={copy.prizes.second}>
        {result.second.map((ticket) => (
          <p key={`second-${ticket.group}-${ticket.number}`}>
            {ticket.group}
            {copy.groupSuffix} {ticket.number}
          </p>
        ))}
      </Grade>
      <Grade level={gradeLevel} title={copy.grades.third} prize={copy.prizes.third}>
        {result.third.map((ticket) => (
          <p key={`third-${ticket.group}-${ticket.number}`}>
            {copy.groupLast} {ticket.group} {ticket.number}
          </p>
        ))}
      </Grade>
      <Grade level={gradeLevel} title={copy.grades.fourth} prize={copy.prizes.fourth}>
        {result.fourth.map((number) => (
          <p key={`fourth-${number}`}>
            {copy.last3} {number}
          </p>
        ))}
      </Grade>
      <Grade level={gradeLevel} title={copy.grades.fifth} prize={copy.prizes.fifth}>
        {result.fifth.map((number) => (
          <p key={`fifth-${number}`}>
            {copy.last2} {number}
          </p>
        ))}
      </Grade>
      <Grade level={gradeLevel} title={copy.grades.sixth} prize={copy.prizes.sixth}>
        {result.sixth.map((number) => (
          <p key={`sixth-${number}`}>
            {copy.last1} {number}
          </p>
        ))}
      </Grade>
      <p className="caption lottery-overlap">{copy.overlap}</p>
    </div>
  );
}
