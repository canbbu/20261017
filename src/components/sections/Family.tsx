import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/interactive/Reveal";

function ParentLine({
  parents,
}: {
  parents: ReadonlyArray<{ relation: string; name: string }>;
}) {
  if (parents.length === 0) {
    return <p className="caption text-ink-muted">가족 성함은 아직 입력되지 않았습니다.</p>;
  }

  return (
    <p className="text-ink-muted">
      {parents.map((parent) => `${parent.relation} ${parent.name}`).join(" ")}
    </p>
  );
}

export function Family() {
  const { groom, bride } = wedding.couple;

  return (
    <section className="section bg-canvas" aria-labelledby="family-title">
      <Reveal className="page-shell mx-auto">
        <h2 id="family-title" className="section-title">
          두 사람
        </h2>
        <div className="grid gap-8">
          <div className="border-t border-line pt-6">
            <p className="ui-label text-ink-muted">신랑</p>
            <p className="mt-2 text-[1.5rem] font-medium">{groom.name}</p>
            <ParentLine parents={groom.parents} />
          </div>
          <div className="border-t border-line pt-6">
            <p className="ui-label text-ink-muted">신부</p>
            <p className="mt-2 text-[1.5rem] font-medium">{bride.name}</p>
            <ParentLine parents={bride.parents} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
