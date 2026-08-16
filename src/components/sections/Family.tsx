import { wedding } from "@/content/wedding";
import { guestParentLine } from "@/lib/content";
import { Reveal } from "@/components/interactive/Reveal";

function FamilyColumn({
  label,
  name,
  parents,
  childWord,
}: {
  label: string;
  name: string;
  parents: ReadonlyArray<{ name: string }>;
  childWord: "아들" | "딸";
}) {
  const line = guestParentLine(parents, childWord);

  return (
    <div className="min-w-0">
      <p className="caption text-ink-muted">{label}</p>
      <p className="mt-2 font-serif text-[1.35rem]">{name}</p>
      {line ? <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-muted">{line}</p> : null}
    </div>
  );
}

export function Family() {
  const { groom, bride } = wedding.couple;

  return (
    <section className="section bg-canvas pt-0" aria-labelledby="family-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="family-title" className="sr-only">
          두 사람
        </h2>
        <div className="contact-card grid grid-cols-2 text-center">
          <div className="pr-3">
            <FamilyColumn label="신랑" name={groom.name} parents={groom.parents} childWord="아들" />
          </div>
          <div className="border-l border-line pl-3">
            <FamilyColumn label="신부" name={bride.name} parents={bride.parents} childWord="딸" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
