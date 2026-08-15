import type { Metadata } from "next";
import { wedding } from "@/content/wedding";
import { formatEventDateLine } from "@/lib/calendar";
import { coupleNames } from "@/lib/content";

export function buildMetadata(): Metadata {
  const title = `${coupleNames()}, 결혼합니다`;
  const dateLine = formatEventDateLine(wedding.event.startsAt, wedding.event.timezone);
  const description = `${dateLine}, ${wedding.event.venueName}에서 결혼합니다. 오시는 길과 인사를 이 초대장에서 확인하세요.`;

  return {
    metadataBase: new URL("https://localhost"),
    title,
    description,
    robots: wedding.privacy.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}
