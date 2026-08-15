import type { CSSProperties } from "react";
import { wedding } from "@/content/wedding";
import { formatHeroDateLine } from "@/lib/calendar";
import { coupleNames } from "@/lib/content";
import { HeroPhotoMotion, HeroTextMotion } from "@/components/interactive/HeroEntrance";
import { SafeImage } from "@/components/interactive/SafeImage";

export function Hero() {
  const dateLine = formatHeroDateLine(wedding.event.startsAt, wedding.event.timezone);

  return (
    <section
      className="hero-frame relative overflow-hidden bg-canvas"
      aria-label="청첩장 첫 화면"
      style={
        {
          "--hero-pos": wedding.hero.objectPositionMobile,
          "--hero-pos-desktop": wedding.hero.objectPositionDesktop,
        } as CSSProperties
      }
    >
      <HeroPhotoMotion>
        <SafeImage
          src={wedding.hero.src}
          alt={wedding.hero.alt}
          fill
          fallbackLabel="대표"
          priority
          sizes="100vw"
          className="hero-photo"
        />
      </HeroPhotoMotion>
      <div className="hero-shade pointer-events-none absolute inset-x-0 top-0 h-[42%]" />
      <div className="absolute inset-x-0 top-0 px-5 pt-[max(34px,env(safe-area-inset-top))] text-center text-canvas">
        <HeroTextMotion title={wedding.copy.heroTitle} names={coupleNames()} date={dateLine} />
      </div>
    </section>
  );
}
