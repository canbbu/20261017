import { Italianno } from "next/font/google";
import { allura } from "@/lib/hero-fonts";
import type { HeroScriptPreviewId } from "@/lib/hero-script-preview";

export const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  fallback: ["cursive"],
  preload: true,
});

export function prototypeScriptClassName(id: HeroScriptPreviewId): string {
  if (id === "italianno") {
    return italianno.className;
  }

  if (id === "allura") {
    return allura.className;
  }

  return "";
}
