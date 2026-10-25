import type { Metadata } from "next";
import { wedding } from "@/content/wedding";
import { coupleNames } from "@/lib/content";

export function buildMetadata(): Metadata {
  const title = wedding.thanks.lotteryTitle;
  const description = `${coupleNames()}. ${wedding.thanks.sentence}`;
  const ogImage = {
    url: wedding.og.src,
    width: wedding.og.width,
    height: wedding.og.height,
    alt: wedding.og.alt,
  };

  return {
    metadataBase: new URL("https://20261017.vercel.app"),
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
      url: "/",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
