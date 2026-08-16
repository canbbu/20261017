import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/interactive/Reveal";

function ParentLine({
  parents,
}: {
  parents: ReadonlyArray<{ relation: string; name: string }>;
}) {
  if (parents.length === 0) {
    return null;
  }

  return (
    <p className="mt-2 text-[0.875rem] text-ink-muted">
      {parents.map((parent) => `${parent.relation} ${parent.name}`).join(" ")}
    </p>
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
          <div className="min-w-0 pr-3">
            <p className="caption text-ink-muted">신랑</p>
            <p className="mt-2 font-serif text-[1.35rem]">{groom.name}</p>
            <ParentLine parents={groom.parents} />
          </div>
          <div className="min-w-0 border-l border-line pl-3">
            <p className="caption text-ink-muted">신부</p>
            <p className="mt-2 font-serif text-[1.35rem]">{bride.name}</p>
            <ParentLine parents={bride.parents} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
