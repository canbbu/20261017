import { wedding } from "@/content/wedding";
import { formatHeroDateLine } from "@/lib/calendar";
import { cormorant } from "@/lib/hero-fonts";
import { SafeImage } from "@/components/interactive/SafeImage";
import "./HeroLayers.css";

export function HeroLayers() {
  const dateLine = formatHeroDateLine(wedding.event.startsAt, wedding.event.timezone);
  const dateTime = wedding.event.startsAt.slice(0, 10);
  const headline = wedding.copy.heroHeadline.join(" ");

  return (
    <div className="hero-layers-stage">
      <section className="hero-layers" aria-label="청첩장 첫 화면">
        <div className="hero-layers__photo">
          <SafeImage
            src={wedding.hero.src}
            alt={wedding.hero.alt}
            fill
            fallbackLabel="대표"
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="hero-layers__photo-image"
          />
        </div>

        <h1 className="sr-only">{headline}</h1>

        <div className="hero-layers__script">
          <div className="hero-layers__script-motion">
            <div className="hero-layers__script-reveal">
              <SafeImage
                src={wedding.heroScript.src}
                alt=""
                width={wedding.heroScript.width}
                height={wedding.heroScript.height}
                fallbackLabel="필기체"
                priority
                className="hero-layers__script-image"
              />
            </div>
          </div>
        </div>

        <p className="hero-layers__names">
          {wedding.couple.groom.name} <span className="hero-layers__names-dot">·</span>{" "}
          {wedding.couple.bride.name}
        </p>

        <time className={`hero-layers__date ${cormorant.className}`} dateTime={dateTime}>
          {dateLine}
        </time>
      </section>
    </div>
  );
}
