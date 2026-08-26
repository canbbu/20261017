import { wedding } from "@/content/wedding";
import { formatHeroDateLine } from "@/lib/calendar";
import { allura, cormorant } from "@/lib/hero-fonts";
import type { HeroScriptPreviewId } from "@/lib/hero-script-preview";
import { HeroPhotoMotion, HeroTextMotion } from "@/components/interactive/HeroEntrance";
import { SafeImage } from "@/components/interactive/SafeImage";
import "./Hero.css";

export function Hero({
  scriptClassName = allura.className,
  scriptTone,
}: {
  scriptClassName?: string;
  scriptTone?: HeroScriptPreviewId;
} = {}) {
  const dateLine = formatHeroDateLine(wedding.event.startsAt, wedding.event.timezone);
  const dateTime = wedding.event.startsAt.slice(0, 10);

  return (
    <div className="hero-stage">
      <section className="hero" aria-label="청첩장 첫 화면">
        <HeroPhotoMotion>
          <SafeImage
            src={wedding.hero.src}
            alt={wedding.hero.alt}
            fill
            fallbackLabel="대표"
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="hero__image"
          />
        </HeroPhotoMotion>
        <HeroTextMotion
          headline={wedding.copy.heroHeadline}
          groomName={wedding.couple.groom.name}
          brideName={wedding.couple.bride.name}
          date={dateLine}
          dateTime={dateTime}
          scriptClassName={[scriptClassName, scriptTone ? `hero__headline--${scriptTone}` : ""]
            .filter(Boolean)
            .join(" ")}
          dateClassName={cormorant.className}
        />
      </section>
    </div>
  );
}
