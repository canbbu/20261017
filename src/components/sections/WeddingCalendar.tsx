import { wedding } from "@/content/wedding";
import {
  buildMonthGrid,
  formatEventDateLine,
  getDateParts,
} from "@/lib/calendar";
import { Reveal } from "@/components/interactive/Reveal";

export function WeddingCalendar() {
  const parts = getDateParts(wedding.event.startsAt, wedding.event.timezone);
  const days = buildMonthGrid(wedding.event.startsAt, wedding.event.timezone);
  const dateLine = formatEventDateLine(wedding.event.startsAt, wedding.event.timezone);

  return (
    <section className="section bg-surface-muted" aria-labelledby="calendar-title">
      <Reveal className="page-shell mx-auto">
        <div className="calendar-card">
          <h2 id="calendar-title" className="calendar-date">
            {`${parts.year}. ${String(parts.month).padStart(2, "0")}. ${String(parts.day).padStart(2, "0")}`}
            <span>SAT</span>
          </h2>
          <p className="mt-2 text-center text-[0.9375rem] text-ink-muted">{dateLine}</p>
        <p className="sr-only">
          {`${parts.year}년 ${parts.month}월 달력에서 ${parts.day}일이 예식일입니다.`}
        </p>
          <div className="mt-7 border-t border-line pt-5">
            <div className="grid grid-cols-7 gap-y-1 text-center">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((label) => (
              <span key={label} className="caption text-ink-muted">
                {label}
              </span>
            ))}
            {days.map((cell) => {
              const dateNumber = cell.date.getDate();
              const key = cell.date.toISOString();
              if (!cell.inMonth) {
                return <span key={key} className="min-h-9" />;
              }
              return (
                <span
                  key={key}
                  className={`mx-auto flex size-9 items-center justify-center ${
                    cell.isWeddingDay
                      ? "rounded-full bg-accent text-canvas"
                      : "text-ink"
                  }`}
                  aria-current={cell.isWeddingDay ? "date" : undefined}
                >
                  {dateNumber}
                </span>
              );
            })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
