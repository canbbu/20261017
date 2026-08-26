import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HeroScriptPreviewNav } from "@/components/sections/HeroScriptPreviewNav";
import { PrototypeSwitch } from "@/components/sections/PrototypeSwitch";
import {
  heroScriptPreviews,
  parseHeroScriptPreviewId,
} from "@/lib/hero-script-preview";
import { prototypeScriptClassName } from "@/lib/prototype-fonts";
import "./prototype.css";

export const metadata: Metadata = {
  title: "영문 제목 서체 시안",
  robots: { index: false, follow: false },
};

export default async function PrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ font?: string }>;
}) {
  const { font } = await searchParams;
  const current = parseHeroScriptPreviewId(font);
  const preview = heroScriptPreviews[current];

  return (
    <main className="script-preview">
      <Hero scriptClassName={prototypeScriptClassName(current)} scriptTone={current} />
      <section className="script-preview__panel">
        <PrototypeSwitch current="fonts" />
        <p className="script-preview__label">{preview.label}</p>
        <p className="script-preview__note">{preview.note}</p>
        <HeroScriptPreviewNav current={current} />
        <p className="script-preview__hint">
          영문 제목만 서체가 바뀝니다. 이름과 날짜는 그대로입니다.
        </p>
      </section>
    </main>
  );
}
