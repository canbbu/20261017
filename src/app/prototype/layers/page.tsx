import type { Metadata } from "next";
import { HeroLayers } from "@/components/sections/HeroLayers";
import { PrototypeSwitch } from "@/components/sections/PrototypeSwitch";
import "../prototype.css";

export const metadata: Metadata = {
  title: "히어로 레이어 시안",
  robots: { index: false, follow: false },
};

export default function LayerPrototypePage() {
  return (
    <main className="script-preview">
      <HeroLayers />
      <section className="script-preview__panel">
        <PrototypeSwitch current="layers" />
        <p className="script-preview__label">레이어 히어로</p>
        <p className="script-preview__note">
          사진은 원본, 필기체는 투명 PNG, 이름과 날짜는 HTML입니다. 등장 순서는 사진, 필기체, 이름, 날짜입니다.
        </p>
      </section>
    </main>
  );
}
