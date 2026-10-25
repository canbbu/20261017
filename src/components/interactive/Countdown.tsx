"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { remainingParts } from "@/lib/lottery";

export function Countdown({ drawAt, initialNow }: { drawAt: string; initialNow: string }) {
  const router = useRouter();
  const refreshed = useRef(false);
  const [now, setNow] = useState(() => new Date(initialNow).getTime());
  const parts = remainingParts(new Date(now), new Date(drawAt));

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (parts || refreshed.current) {
      return;
    }

    refreshed.current = true;
    router.refresh();
  }, [parts, router]);

  if (!parts) {
    return null;
  }

  const units = [
    [parts.days, wedding.thanks.day],
    [parts.hours, wedding.thanks.hour],
    [parts.minutes, wedding.thanks.minute],
    [parts.seconds, wedding.thanks.second],
  ] as const;

  return (
    <p className="countdown">
      <span className="caption">{wedding.thanks.countdownLabel}</span>
      <span className="countdown-units">
        {units.map(([value, label]) => (
          <span key={label}>
            <b>{value}</b>
            <span className="caption">{label}</span>
          </span>
        ))}
      </span>
    </p>
  );
}
