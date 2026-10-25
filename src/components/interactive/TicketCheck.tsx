"use client";

import { useState, type FormEvent } from "react";
import { wedding } from "@/content/wedding";
import { describeTicket, matchTicket, type LotteryResult, type TicketReading } from "@/lib/lottery";

function TicketResult({ reading }: { reading: TicketReading }) {
  const copy = wedding.thanks.check;

  if (reading.tone === "hit") {
    return (
      <div className="ticket-result" role="status">
        <p className="caption">{copy.lead}</p>
        <p className="ticket-result-grade">{reading.grade}</p>
        <p className="ticket-result-prize">{reading.prize}</p>
        {reading.lines.map((line) => (
          <p key={line} className="ticket-result-detail">
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={reading.tone === "invalid" ? "ticket-result ticket-result-invalid" : "ticket-result"} role="status">
      <p className="ticket-result-grade">{reading.title}</p>
      {reading.lines.map((line) => (
        <p key={line} className="ticket-result-detail">
          {line}
        </p>
      ))}
    </div>
  );
}

export function TicketCheck({ result }: { result: LotteryResult }) {
  const copy = wedding.thanks.check;
  const [group, setGroup] = useState("");
  const [number, setNumber] = useState("");
  const [reading, setReading] = useState<TicketReading | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReading(describeTicket(matchTicket(result, group, number)));
  }

  return (
    <form className="ticket-check" onSubmit={onSubmit}>
      <h2 className="lottery-grade-title">{copy.title}</h2>
      <p className="caption">{copy.hint}</p>
      <div className="ticket-check-row">
        <label className="ui-label" htmlFor="ticket-group">
          {copy.groupLabel}
          <input
            id="ticket-group"
            className="field field-single"
            inputMode="numeric"
            autoComplete="off"
            maxLength={2}
            value={group}
            onChange={(event) => setGroup(event.target.value)}
          />
        </label>
        <label className="ui-label" htmlFor="ticket-number">
          {copy.numberLabel}
          <input
            id="ticket-number"
            className="field field-single"
            inputMode="numeric"
            autoComplete="off"
            maxLength={6}
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
        </label>
      </div>
      <button className="solid-button control" type="submit">
        {copy.submit}
      </button>
      {reading ? <TicketResult reading={reading} /> : null}
    </form>
  );
}
