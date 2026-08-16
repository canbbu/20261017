import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/interactive/Reveal";

export function Invitation() {
  return (
    <section className="section bg-canvas" aria-labelledby="invitation-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="invitation-title" className="sr-only">
          초대 인사
        </h2>
        <p className="prose-block mx-auto whitespace-pre-line text-center font-serif text-[clamp(0.875rem,3.2vw,0.975rem)] leading-[1.9] text-ink">
          {wedding.copy.invitation}
        </p>
      </Reveal>
    </section>
  );
}
